using LearnProgramming.Domain.Enums;

namespace LearnProgramming.Domain.Entities
{
    public class LearningTopic
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty!;
        public Difficulty DifficultyInText { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
