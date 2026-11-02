
namespace OurLittleGarden.Api.Models;

/// <summary>
/// ข้อความจดหมายที่เตรียมไว้ในฐานข้อมูล
/// </summary>
public class LetterMessage
{
    public int Id { get; set; }

    public string Content { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
