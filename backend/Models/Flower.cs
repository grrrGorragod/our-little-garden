
namespace OurLittleGarden.Api.Models;

public class Flower
{
    public int Id { get; set; }

    // ชนิดดอกไม้: tulip, daisy, sunflower
    public string Type { get; set; } = "tulip";

    // ตำแหน่งดอกไม้ในสวน
    public int Col { get; set; }
    public int Row { get; set; }

    // เวลาที่ปลูกดอกไม้
    public DateTime PlantedAt { get; set; } = DateTime.UtcNow;

    // ระบุว่าเป็นดอกไม้ทดสอบหรือไม่
    public bool IsTestFlower { get; set; } = false;
}
