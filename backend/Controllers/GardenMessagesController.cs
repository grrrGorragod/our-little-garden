
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurLittleGarden.Api.Data;
using OurLittleGarden.Api.Models;

namespace OurLittleGarden.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GardenMessagesController : ControllerBase
{
    private readonly GardenDbContext _db;

    public GardenMessagesController(GardenDbContext db)
    {
        _db = db;
    }

    // GET /api/GardenMessages
    [HttpGet]
    public async Task<ActionResult<GardenMessage>> GetMessage()
    {
        var message = await _db.GardenMessages
            .AsNoTracking()
            .OrderBy(m => m.Id)
            .FirstOrDefaultAsync();

        if (message is null)
        {
            message = new GardenMessage
            {
                Message = "ขอบคุณที่เข้ามาเป็นส่วนหนึ่งของสวนเล็ก ๆ แห่งนี้นะ 🌷",
                UpdatedAt = DateTime.UtcNow
            };

            _db.GardenMessages.Add(message);
            await _db.SaveChangesAsync();
        }

        return Ok(message);
    }
}