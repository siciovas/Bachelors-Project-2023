namespace LearnProgramming.Core.Dto
{
    public class ProgrammingTaskDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Description { get; set; } = string.Empty!;
        public string LearningTopicName { get; set; } = string.Empty!;
        public string SubTopicName { get; set; } = string.Empty!;
    }
}
