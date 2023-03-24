namespace LearnProgramming.Domain.Entities
{
    public class Submission
    {
        public int Id { get; set; }
        public string Topic { get; set; } = string.Empty!;
        public string Message { get; set;} = string.Empty!;
        public User User { get; set; }
        public Guid UserId { get; set; }

    }
}
