
namespace OurLittleGarden.Api.Models;

public class GardenMessage
{
    public int Id { get; set; }

    // ข้อความที่แสดงในจดหมาย
    public string Message { get; set; } =
        "ขอบคุณที่เข้ามาเป็นส่วนหนึ่งของสวนเล็ก ๆ แห่งนี้นะ";

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
