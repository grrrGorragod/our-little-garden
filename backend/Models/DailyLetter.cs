
using System.ComponentModel.DataAnnotations;

namespace OurLittleGarden.Api.Models;

/// <summary>
/// จดหมายที่เลือกไว้สำหรับแต่ละวันตามวันที่ประเทศไทย
/// </summary>
public class DailyLetter
{
    [Key]
    public DateOnly LetterDate { get; set; }

    public int LetterMessageId { get; set; }

    public LetterMessage LetterMessage { get; set; } = null!;

    // ชนิดดอกไม้ที่แสดงคู่กับจดหมายในวันนั้น
    public string FlowerType { get; set; } = "tulip";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
