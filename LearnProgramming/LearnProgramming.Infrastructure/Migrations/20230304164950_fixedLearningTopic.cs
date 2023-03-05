using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnProgramming.Infrastructure.Migrations
{
    public partial class fixedLearningTopic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DifficultyInStars",
                table: "LearningTopics");

            migrationBuilder.DropColumn(
                name: "NumberOfAllTasks",
                table: "LearningTopics");

            migrationBuilder.DropColumn(
                name: "NumberOfSubTopics",
                table: "LearningTopics");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DifficultyInStars",
                table: "LearningTopics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfAllTasks",
                table: "LearningTopics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfSubTopics",
                table: "LearningTopics",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
