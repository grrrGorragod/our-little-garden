
using System.ComponentModel.DataAnnotations;

namespace OurLittleGarden.Api.Models;

/// <summary>
/// บันทึกว่าสวนได้รับดอกไม้ไปแล้วในวันใด
/// ใช้วันที่ประเทศไทยเป็นกุญแจหลัก ป้องกันการรับซ้ำ
/// </summary>
public class DailyFlowerClaim
{
    [Key]
    public DateOnly ClaimDate { get; set; }
}
