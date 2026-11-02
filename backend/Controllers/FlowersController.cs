
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
        var allowedTypes = new[] { "tulip", "daisy", "sunflower" };

        if (!allowedTypes.Contains(request.Type))
        {
            return BadRequest(new
            {
                message = "ชนิดดอกไม้ต้องเป็น tulip, daisy หรือ sunflower"
            });
        }

        if (request.Col < 0 || request.Row < 0)
        {
            return BadRequest(new
            {
                message = "ตำแหน่งดอกไม้ต้องไม่ติดลบ"
            });
        }

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
