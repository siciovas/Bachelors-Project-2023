namespace LearnProgramming.Core.Dto
{
    public class OrderItemDto
    {
        public string Name { get; set; }
        public byte[] Photo { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; } = 1;
        public int OrderId { get; set; }
        public int ProductId { get; set; }
    }
}
