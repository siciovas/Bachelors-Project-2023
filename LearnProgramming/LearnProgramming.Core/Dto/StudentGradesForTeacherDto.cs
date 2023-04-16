namespace LearnProgramming.Core.Dto
{
    public class StudentGradesForTeacherDto
    {
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public List<StudentGradesDto> Grades { get; set; } = new();
    }
}
