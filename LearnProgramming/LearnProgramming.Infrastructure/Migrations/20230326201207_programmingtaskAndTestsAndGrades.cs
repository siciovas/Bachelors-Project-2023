using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnProgramming.Infrastructure.Migrations
{
    public partial class programmingtaskAndTestsAndGrades : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgrammingTask_LearningTopics_LearningTopicId",
                table: "ProgrammingTask");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgrammingTask_SubTopics_SubTopicId",
                table: "ProgrammingTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProgrammingTask",
                table: "ProgrammingTask");

            migrationBuilder.DropColumn(
                name: "AdditionalInformation",
                table: "ProgrammingTask");

            migrationBuilder.RenameTable(
                name: "ProgrammingTask",
                newName: "ProgrammingTasks");

            migrationBuilder.RenameIndex(
                name: "IX_ProgrammingTask_SubTopicId",
                table: "ProgrammingTasks",
                newName: "IX_ProgrammingTasks_SubTopicId");

            migrationBuilder.RenameIndex(
                name: "IX_ProgrammingTask_LearningTopicId",
                table: "ProgrammingTasks",
                newName: "IX_ProgrammingTasks_LearningTopicId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProgrammingTasks",
                table: "ProgrammingTasks",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ProgrammingTaskTests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Input = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Output = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProgrammingTaskId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgrammingTaskTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProgrammingTaskTests_ProgrammingTasks_ProgrammingTaskId",
                        column: x => x.ProgrammingTaskId,
                        principalTable: "ProgrammingTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StudentGrades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Grade = table.Column<int>(type: "int", nullable: false),
                    ProgrammingTaskId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentGrades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentGrades_ProgrammingTasks_ProgrammingTaskId",
                        column: x => x.ProgrammingTaskId,
                        principalTable: "ProgrammingTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ProgrammingTaskTests_ProgrammingTaskId",
                table: "ProgrammingTaskTests",
                column: "ProgrammingTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentGrades_ProgrammingTaskId",
                table: "StudentGrades",
                column: "ProgrammingTaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgrammingTasks_LearningTopics_LearningTopicId",
                table: "ProgrammingTasks",
                column: "LearningTopicId",
                principalTable: "LearningTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgrammingTasks_SubTopics_SubTopicId",
                table: "ProgrammingTasks",
                column: "SubTopicId",
                principalTable: "SubTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgrammingTasks_LearningTopics_LearningTopicId",
                table: "ProgrammingTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgrammingTasks_SubTopics_SubTopicId",
                table: "ProgrammingTasks");

            migrationBuilder.DropTable(
                name: "ProgrammingTaskTests");

            migrationBuilder.DropTable(
                name: "StudentGrades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProgrammingTasks",
                table: "ProgrammingTasks");

            migrationBuilder.RenameTable(
                name: "ProgrammingTasks",
                newName: "ProgrammingTask");

            migrationBuilder.RenameIndex(
                name: "IX_ProgrammingTasks_SubTopicId",
                table: "ProgrammingTask",
                newName: "IX_ProgrammingTask_SubTopicId");

            migrationBuilder.RenameIndex(
                name: "IX_ProgrammingTasks_LearningTopicId",
                table: "ProgrammingTask",
                newName: "IX_ProgrammingTask_LearningTopicId");

            migrationBuilder.AddColumn<byte[]>(
                name: "AdditionalInformation",
                table: "ProgrammingTask",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProgrammingTask",
                table: "ProgrammingTask",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgrammingTask_LearningTopics_LearningTopicId",
                table: "ProgrammingTask",
                column: "LearningTopicId",
                principalTable: "LearningTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgrammingTask_SubTopics_SubTopicId",
                table: "ProgrammingTask",
                column: "SubTopicId",
                principalTable: "SubTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
