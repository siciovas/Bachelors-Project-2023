namespace LearnProgramming.Domain.Entities
{
    public class ProgrammingTask
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Description { get; set; } = string.Empty!;
        public string ProgrammingCode { get; set; } = string.Empty!;
        public LearningTopic LearningTopic { get; set; } = null!;
        public int LearningTopicId { get; set; }
        public SubTopic SubTopic { get; set; } = null!;
        public int SubTopicId { get; set; }

        public ICollection<ProgrammingTaskTest> ProgrammingTaskTests { get; set; }
    }
}
