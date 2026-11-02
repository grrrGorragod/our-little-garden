
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

    // GET /api/daily-letters/today
    // อ่านจดหมายประจำวัน ถ้ายังไม่มีจะสุ่มและบันทึกให้
    [HttpGet("today")]
    public async Task<IActionResult> GetToday(CancellationToken cancellationToken)
    {
        var today = GetThailandDate();

        // ถ้ามีจดหมายของวันนี้แล้ว ให้ใช้ฉบับเดิม
        var existing = await FindDailyLetter(today, cancellationToken);

        if (existing is not null)
        {
            return Ok(ToResponse(existing));
        }

        // เลือกข้อความที่เปิดใช้งานอยู่
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

        // สุ่มชนิดดอกไม้และบันทึกไว้กับจดหมายประจำวัน
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
            FlowerType = flowerTypes[Random.Shared.Next(flowerTypes.Length)],
            CreatedAt = DateTime.UtcNow
        };

        _db.DailyLetters.Add(dailyLetter);

        try
        {
            await _db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex) when (IsUniqueViolation(ex))
        {
            // หากอุปกรณ์อื่นบันทึกจดหมายของวันนี้ไปก่อนแล้ว
            // ให้ใช้ฉบับที่บันทึกสำเร็จในฐานข้อมูลแทน
            _db.Entry(dailyLetter).State = EntityState.Detached;

            var winner = await FindDailyLetter(today, cancellationToken);

            if (winner is not null)
            {
                return Ok(ToResponse(winner));
            }

            throw;
        }

        // โหลดข้อมูลข้อความเพื่อส่งกลับ
        var saved = await FindDailyLetter(today, cancellationToken);

        if (saved is null)
        {
            return StatusCode(500, new
            {
                message = "บันทึกจดหมายแล้ว แต่ไม่สามารถอ่านข้อมูลกลับได้"
            });
        }

        return Ok(ToResponse(saved));
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
        TimeZoneInfo thailandTimeZone;

        try
        {
            thailandTimeZone =
                TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            thailandTimeZone =
                TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok");
        }

        var thailandNow = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            thailandTimeZone);

        return DateOnly.FromDateTime(thailandNow);
    }

    private static bool IsUniqueViolation(DbUpdateException exception)
    {
        return exception.InnerException is PostgresException postgresException
            && postgresException.SqlState == PostgresErrorCodes.UniqueViolation;
    }
}
