namespace LearnProgramming.Core.Dto.DtoPost
{
    public class ProgrammingTaskPostDto
    {
        public string Name { get; set; } = string.Empty!;
        public string Description { get; set; } = string.Empty!;
        public string ProgrammingCode { get; set; } = string.Empty!;
        public List<ProgrammingTaskTestDto> InputOutput { get; set; } = new();

    }
}
