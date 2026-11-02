
namespace OurLittleGarden.Api.Models;

public class Flower
{
    public int Id { get; set; }

    // ชนิดดอกไม้ เช่น tulip, daisy, sunflower
    public string Type { get; set; } = "tulip";

    // ตำแหน่งดอกไม้ในแปลง
    public int Col { get; set; }
    public int Row { get; set; }

    // วันที่ปลูก
    public DateTime PlantedAt { get; set; } = DateTime.UtcNow;
}
