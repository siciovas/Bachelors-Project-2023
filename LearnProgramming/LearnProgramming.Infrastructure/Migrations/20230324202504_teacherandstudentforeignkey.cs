using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnProgramming.Infrastructure.Migrations
{
    public partial class teacherandstudentforeignkey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "TeacherId",
                table: "TeacherAndStudent",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .Annotation("Relational:ColumnOrder", 0)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<Guid>(
                name: "StudentId",
                table: "TeacherAndStudent",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .Annotation("Relational:ColumnOrder", 1)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAndStudent_StudentId",
                table: "TeacherAndStudent",
                column: "StudentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAndStudent_TeacherId",
                table: "TeacherAndStudent",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherAndStudent_Users_StudentId",
                table: "TeacherAndStudent",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherAndStudent_Users_TeacherId",
                table: "TeacherAndStudent",
                column: "TeacherId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeacherAndStudent_Users_StudentId",
                table: "TeacherAndStudent");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherAndStudent_Users_TeacherId",
                table: "TeacherAndStudent");

            migrationBuilder.DropIndex(
                name: "IX_TeacherAndStudent_StudentId",
                table: "TeacherAndStudent");

            migrationBuilder.DropIndex(
                name: "IX_TeacherAndStudent_TeacherId",
                table: "TeacherAndStudent");

            migrationBuilder.AlterColumn<Guid>(
                name: "TeacherId",
                table: "TeacherAndStudent",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci")
                .OldAnnotation("Relational:ColumnOrder", 0);

            migrationBuilder.AlterColumn<Guid>(
                name: "StudentId",
                table: "TeacherAndStudent",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci")
                .OldAnnotation("Relational:ColumnOrder", 1);
        }
    }
}
