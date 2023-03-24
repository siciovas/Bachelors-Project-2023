namespace LearnProgramming.Domain.Entities
{
    public class ProgrammingTask
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Description { get; set; } = string.Empty!;
        public string DataAndAnswers { get; set; } = string.Empty!;
        public byte[]? AdditionalInformation { get; set; }
        public LearningTopic LearningTopic { get; set; } = null!;
        public int LearningTopicId { get; set; }
        public SubTopic SubTopic { get; set; } = null!;
        public int SubTopicId { get; set; }
    }
}
