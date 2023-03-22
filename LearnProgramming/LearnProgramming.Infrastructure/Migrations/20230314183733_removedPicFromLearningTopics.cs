using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnProgramming.Infrastructure.Migrations
{
    public partial class removedPicFromLearningTopics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "LearningTopics");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Photo",
                table: "LearningTopics",
                type: "longblob",
                nullable: false);
        }
    }
}
