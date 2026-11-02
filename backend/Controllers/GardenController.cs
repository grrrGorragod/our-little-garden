
using Microsoft.AspNetCore.Mvc;

namespace OurLittleGarden.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GardenController : ControllerBase
{
    [HttpGet]
    public IActionResult GetGarden()
    {
        var garden = new
        {
            Name = "Our Little Garden",
            Message = "ยินดีต้อนรับสู่สวนเล็ก ๆ ของเรา 🌷",
            Flowers = 0,
            IsOpen = true
        };

        return Ok(garden);
    }
}
