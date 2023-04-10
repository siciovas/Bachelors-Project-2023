namespace LearnProgramming.Core.Dto.DtoPost
{
    public class OrderItemPostDto
    {
        public string Name { get; set; }
        public int Quantity { get; set; } = 1;
        public int ProductId { get; set; }
    }
}
