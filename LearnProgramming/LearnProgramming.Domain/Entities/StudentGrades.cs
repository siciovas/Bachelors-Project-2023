namespace LearnProgramming.Domain.Entities
{
    public class StudentGrades
    {
        public int Id { get; set; }
        public double Grade { get; set; }
        public int ProgrammingTaskId { get; set; }
        public ProgrammingTask ProgrammingTask { get; set; }
        public User User { get; set; }
        public Guid UserId { get; set; }
    }
}
