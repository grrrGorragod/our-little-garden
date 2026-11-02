using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OurLittleGarden.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsTestFlower : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTestFlower",
                table: "Flowers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTestFlower",
                table: "Flowers");
        }
    }
}
