using LearnProgramming.Domain.Enums;

namespace LearnProgramming.Core.Dto.DtoPost
{
    public class LearningTopicsPostDto
    {
        public string Title { get; set; } = string.Empty!;
        public Difficulty DifficultyInText { get; set; }
    }
}
