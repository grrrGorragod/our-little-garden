
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using OurLittleGarden.Api.Data;
using OurLittleGarden.Api.Models;

namespace OurLittleGarden.Api.Controllers;

[ApiController]
[Route("api/daily-flower-claims")]
public class DailyFlowerClaimsController : ControllerBase
{
    private readonly GardenDbContext _db;

    public DailyFlowerClaimsController(GardenDbContext db)
    {
        _db = db;
    }

    // GET /api/daily-flower-claims/today
    [HttpGet("today")]
    public async Task<IActionResult> GetTodayStatus(
        CancellationToken cancellationToken)
    {
        var today = GetThailandDate();

        var claimed = await _db.DailyFlowerClaims
            .AsNoTracking()
            .AnyAsync(
                claim => claim.ClaimDate == today,
                cancellationToken);

        return Ok(new
        {
            date = today,
            claimedToday = claimed
        });
    }

    // POST /api/daily-flower-claims
    // รับดอกไม้ได้หนึ่งดอกต่อวันสำหรับสวนทั้งหมด
    [HttpPost]
    public async Task<IActionResult> ClaimFlower(
        CancellationToken cancellationToken)
    {
        var today = GetThailandDate();

        // เลือกแปลงที่ยังไม่มีดอกไม้
        var occupiedPlots = await _db.Flowers
            .AsNoTracking()
            .Select(flower => new { flower.Col, flower.Row })
            .ToListAsync(cancellationToken);

        (int Col, int Row)? availablePlot = PLOTS
            .Cast<(int Col, int Row)?>()
            .FirstOrDefault(plot =>
                plot.HasValue &&
                !occupiedPlots.Any(occupied =>
                    occupied.Col == plot.Value.Col &&
                    occupied.Row == plot.Value.Row));

        if (availablePlot is null)
        {
            return Conflict(new
            {
                message = "สวนของเราเต็มแล้ว 🌷"
            });
        }

        await using var transaction =
            await _db.Database.BeginTransactionAsync(
                IsolationLevel.ReadCommitted,
                cancellationToken);

        try
        {
            // Primary Key ของ ClaimDate ป้องกันการรับซ้ำวันเดียวกัน
            _db.DailyFlowerClaims.Add(new DailyFlowerClaim
            {
                ClaimDate = today
            });

            await _db.SaveChangesAsync(cancellationToken);

            var flowerCount = await _db.Flowers.CountAsync(
                cancellationToken);

            var types = new[] { "tulip", "daisy", "sunflower" };

            var flower = new Flower
            {
                Type = types[flowerCount % types.Length],
                Col = availablePlot.Value.Col,
                Row = availablePlot.Value.Row,
                PlantedAt = DateTime.UtcNow
            };

            _db.Flowers.Add(flower);
            await _db.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            return Ok(new
            {
                message = "รับดอกไม้สำเร็จ 🌷",
                claimedToday = true,
                flower
            });
        }
        catch (DbUpdateException exception)
            when (IsDuplicateKey(exception))
        {
            await transaction.RollbackAsync(cancellationToken);

            return Conflict(new
            {
                message = "วันนี้สวนของเราได้รับดอกไม้แล้วนะ ♡",
                claimedToday = true
            });
        }
    }

    private static bool IsDuplicateKey(DbUpdateException exception)
    {
        return exception.InnerException is PostgresException
        {
            SqlState: PostgresErrorCodes.UniqueViolation
        };
    }

    // ใช้เวลาไทยในการกำหนดวัน
    private static DateOnly GetThailandDate()
    {
        var thailandTimeZone = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows()
                ? "SE Asia Standard Time"
                : "Asia/Bangkok");

        return DateOnly.FromDateTime(
            TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                thailandTimeZone));
    }

    private static readonly (int Col, int Row)[] PLOTS =
    {
        (3, 2), (5, 2), (2, 3), (4, 3), (6, 3),
        (3, 4), (5, 4), (2, 5), (4, 5), (6, 5),
        (3, 6), (5, 6), (4, 7), (1, 4), (7, 4),
        (1, 6), (7, 6), (2, 7), (6, 7), (3, 8),
        (5, 8), (4, 9), (2, 9), (6, 9), (1, 8),
        (7, 8), (3, 10), (5, 10), (2, 11), (6, 11)
    };
}
