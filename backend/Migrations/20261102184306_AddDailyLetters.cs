using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace OurLittleGarden.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyLetters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LetterMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Content = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LetterMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DailyLetters",
                columns: table => new
                {
                    LetterDate = table.Column<DateOnly>(type: "date", nullable: false),
                    LetterMessageId = table.Column<int>(type: "integer", nullable: false),
                    FlowerType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyLetters", x => x.LetterDate);
                    table.ForeignKey(
                        name: "FK_DailyLetters_LetterMessages_LetterMessageId",
                        column: x => x.LetterMessageId,
                        principalTable: "LetterMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyLetters_LetterMessageId",
                table: "DailyLetters",
                column: "LetterMessageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyLetters");

            migrationBuilder.DropTable(
                name: "LetterMessages");
        }
    }
}
