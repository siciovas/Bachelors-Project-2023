using LearnProgramming.Domain.Enums;

namespace LearnProgramming.Core.Dto
{
    public class LearningTopicsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty!;
        public int NumberOfSubTopics { get; set; }
        public int NumberOfAllTasks { get; set; }
        public Difficulty DifficultyInText { get; set; }
        public Guid UserId { get; set; }

    }
}
