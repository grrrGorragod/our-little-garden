using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OurLittleGarden.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyFlowerClaims : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailyFlowerClaims",
                columns: table => new
                {
                    ClaimDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyFlowerClaims", x => x.ClaimDate);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyFlowerClaims");
        }
    }
}
