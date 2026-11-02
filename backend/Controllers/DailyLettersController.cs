
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using OurLittleGarden.Api.Data;
using OurLittleGarden.Api.Models;

namespace OurLittleGarden.Api.Controllers;

[ApiController]
[Route("api/daily-letters")]
public class DailyLettersController : ControllerBase
{
    private readonly GardenDbContext _db;

    public DailyLettersController(GardenDbContext db)
    {
        _db = db;
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday(
        CancellationToken cancellationToken)
    {
        var today = GetThailandDate();

        // ถ้ามีจดหมายแล้ว ให้ปรับชนิดดอกไม้ให้ตรงกับดอกไม้จริง
        var existing = await FindDailyLetter(today, cancellationToken);

        if (existing is not null)
        {
            await SyncFlowerType(existing, today, cancellationToken);
            return Ok(ToResponse(existing));
        }

        var messageIds = await _db.LetterMessages
            .AsNoTracking()
            .Where(message => message.IsActive)
            .Select(message => message.Id)
            .ToListAsync(cancellationToken);

        if (messageIds.Count == 0)
        {
            return Conflict(new
            {
                message = "ยังไม่มีข้อความจดหมายที่เปิดใช้งานในฐานข้อมูล"
            });
        }

        var selectedId = messageIds[Random.Shared.Next(messageIds.Count)];

        // ใช้ดอกไม้ที่ปลูกจริงวันนี้ก่อน ถ้ายังไม่มีจึงสุ่มเป็นค่าเริ่มต้น
        var actualFlowerType =
            await FindTodayFlowerType(today, cancellationToken);

        var flowerTypes = new[]
        {
            "tulip",
            "rose",
            "sunflower",
            "daisy",
            "lily"
        };

        var dailyLetter = new DailyLetter
        {
            LetterDate = today,
            LetterMessageId = selectedId,
            FlowerType = actualFlowerType
                ?? flowerTypes[Random.Shared.Next(flowerTypes.Length)],
            CreatedAt = DateTime.UtcNow
        };

        _db.DailyLetters.Add(dailyLetter);

        try
        {
            await _db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex) when (IsUniqueViolation(ex))
        {
            _db.Entry(dailyLetter).State = EntityState.Detached;

            var winner = await FindDailyLetter(today, cancellationToken);

            if (winner is not null)
            {
                await SyncFlowerType(winner, today, cancellationToken);
                return Ok(ToResponse(winner));
            }

            throw;
        }

        var saved = await FindDailyLetter(today, cancellationToken);

        if (saved is null)
        {
            return StatusCode(500, new
            {
                message = "บันทึกจดหมายแล้ว แต่ไม่สามารถอ่านข้อมูลกลับได้"
            });
        }

        // เผื่อมีการปลูกดอกไม้ระหว่างสร้างจดหมาย
        await SyncFlowerType(saved, today, cancellationToken);

        return Ok(ToResponse(saved));
    }

    private async Task SyncFlowerType(
        DailyLetter letter,
        DateOnly date,
        CancellationToken cancellationToken)
    {
        var actualFlowerType =
            await FindTodayFlowerType(date, cancellationToken);

        if (actualFlowerType is not null &&
            letter.FlowerType != actualFlowerType)
        {
            letter.FlowerType = actualFlowerType;
            await _db.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task<string?> FindTodayFlowerType(
        DateOnly date,
        CancellationToken cancellationToken)
    {
        var timeZone = GetThailandTimeZone();

        var localStart = DateTime.SpecifyKind(
            date.ToDateTime(TimeOnly.MinValue),
            DateTimeKind.Unspecified);

        var localEnd = DateTime.SpecifyKind(
            date.AddDays(1).ToDateTime(TimeOnly.MinValue),
            DateTimeKind.Unspecified);

        var startUtc = TimeZoneInfo.ConvertTimeToUtc(
            localStart, timeZone);

        var endUtc = TimeZoneInfo.ConvertTimeToUtc(
            localEnd, timeZone);

        return await _db.Flowers
            .AsNoTracking()
            .Where(flower =>
                flower.PlantedAt >= startUtc &&
                flower.PlantedAt < endUtc)
            .OrderByDescending(flower => flower.PlantedAt)
            .Select(flower => flower.Type)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private async Task<DailyLetter?> FindDailyLetter(
        DateOnly date,
        CancellationToken cancellationToken)
    {
        return await _db.DailyLetters
            .AsNoTracking()
            .Include(letter => letter.LetterMessage)
            .FirstOrDefaultAsync(
                letter => letter.LetterDate == date,
                cancellationToken);
    }

    private static object ToResponse(DailyLetter letter)
    {
        return new
        {
            date = letter.LetterDate,
            content = letter.LetterMessage.Content,
            flowerType = letter.FlowerType
        };
    }

    private static DateOnly GetThailandDate()
    {
        var thailandNow = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            GetThailandTimeZone());

        return DateOnly.FromDateTime(thailandNow);
    }

    private static TimeZoneInfo GetThailandTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(
                "SE Asia Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById(
                "Asia/Bangkok");
        }
    }

    private static bool IsUniqueViolation(DbUpdateException exception)
    {
        return exception.InnerException is PostgresException postgresException
            && postgresException.SqlState ==
               PostgresErrorCodes.UniqueViolation;
    }
}
