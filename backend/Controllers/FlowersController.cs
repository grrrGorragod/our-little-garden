using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurLittleGarden.Api.Data;
using OurLittleGarden.Api.Models;

namespace OurLittleGarden.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlowersController : ControllerBase
{
    private readonly GardenDbContext _db;

    public FlowersController(GardenDbContext db)
    {
        _db = db;
    }

    // GET /api/flowers
    // อ่านดอกไม้ทั้งหมดจาก PostgreSQL
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Flower>>> GetFlowers()
    {
        var flowers = await _db.Flowers
            .AsNoTracking()
            .OrderBy(f => f.Id)
            .ToListAsync();

        return Ok(flowers);
    }

    // POST /api/flowers
    // เพิ่มดอกไม้หนึ่งดอกลงฐานข้อมูล
    [HttpPost]
    public async Task<ActionResult<Flower>> CreateFlower(
        [FromBody] CreateFlowerRequest request)
    {
        var allowedTypes = new[]
        {
            "tulip",
            "daisy",
            "sunflower",
            "cherry-blossom",
            "rose",
            "lavender",
            "babys-breath",
            "peony",
            "hydrangea"
        };

        if (!allowedTypes.Contains(request.Type))
        {
            return BadRequest(new
            {
                message = "ชนิดดอกไม้่ถูกต้อง"
            });
        }

        // พิกัดแปลงปลูกที่อนุญาต
        var validPlots = new (int Col, int Row)[]
        {
            (3, 2), (5, 2), (2, 3), (4, 3), (6, 3),
            (3, 4), (5, 4), (2, 5), (4, 5), (6, 5),
            (3, 6), (5, 6), (4, 7), (1, 4), (7, 4),
            (1, 6), (7, 6), (2, 7), (6, 7), (3, 8),
            (5, 8), (4, 9), (2, 9), (6, 9), (1, 8),
            (7, 8), (3, 10), (5, 10), (2, 11), (6, 11)
        };

        if (!validPlots.Contains((request.Col, request.Row)))
        {
            return BadRequest(new
            {
                message = "ตำแหน่งนี้ไม่ใช่แปลงปลูกดอกไม้"
            });
        }

        // สร้างดอกไม้หลังตรวจสอบข้อมูลผ่านแล้ว
        var flower = new Flower
        {
            Type = request.Type,
            Col = request.Col,
            Row = request.Row,
            PlantedAt = DateTime.UtcNow
        };

        _db.Flowers.Add(flower);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetFlowers),
            new { id = flower.Id },
            flower);
    }
}

public class CreateFlowerRequest
{
    public string Type { get; set; } = "tulip";
    public int Col { get; set; }
    public int Row { get; set; }
}