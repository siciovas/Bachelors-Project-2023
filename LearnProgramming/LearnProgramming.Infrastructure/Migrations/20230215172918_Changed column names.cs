using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnProgramming.Infrastructure.Migrations
{
    public partial class Changedcolumnnames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubTopics_LearningTopics_LearningTopicsId",
                table: "SubTopics");

            migrationBuilder.DropForeignKey(
                name: "FK_Task_SubTopics_SubTopicsId",
                table: "Task");

            migrationBuilder.RenameColumn(
                name: "SubTopicsId",
                table: "Task",
                newName: "SubTopicId");

            migrationBuilder.RenameIndex(
                name: "IX_Task_SubTopicsId",
                table: "Task",
                newName: "IX_Task_SubTopicId");

            migrationBuilder.RenameColumn(
                name: "LearningTopicsId",
                table: "SubTopics",
                newName: "LearningTopicId");

            migrationBuilder.RenameIndex(
                name: "IX_SubTopics_LearningTopicsId",
                table: "SubTopics",
                newName: "IX_SubTopics_LearningTopicId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubTopics_LearningTopics_LearningTopicId",
                table: "SubTopics",
                column: "LearningTopicId",
                principalTable: "LearningTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Task_SubTopics_SubTopicId",
                table: "Task",
                column: "SubTopicId",
                principalTable: "SubTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SubTopics_LearningTopics_LearningTopicId",
                table: "SubTopics");

            migrationBuilder.DropForeignKey(
                name: "FK_Task_SubTopics_SubTopicId",
                table: "Task");

            migrationBuilder.RenameColumn(
                name: "SubTopicId",
                table: "Task",
                newName: "SubTopicsId");

            migrationBuilder.RenameIndex(
                name: "IX_Task_SubTopicId",
                table: "Task",
                newName: "IX_Task_SubTopicsId");

            migrationBuilder.RenameColumn(
                name: "LearningTopicId",
                table: "SubTopics",
                newName: "LearningTopicsId");

            migrationBuilder.RenameIndex(
                name: "IX_SubTopics_LearningTopicId",
                table: "SubTopics",
                newName: "IX_SubTopics_LearningTopicsId");

            migrationBuilder.AddForeignKey(
                name: "FK_SubTopics_LearningTopics_LearningTopicsId",
                table: "SubTopics",
                column: "LearningTopicsId",
                principalTable: "LearningTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Task_SubTopics_SubTopicsId",
                table: "Task",
                column: "SubTopicsId",
                principalTable: "SubTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
