using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnProgramming.Infrastructure.Migrations
{
    public partial class addedProgrammingCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProgrammingCode",
                table: "ProgrammingTasks",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProgrammingCode",
                table: "ProgrammingTasks");
        }
    }
}
