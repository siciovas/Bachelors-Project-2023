namespace LearnProgramming.Core.Dto
{
    public class OrderItemCollectionDto
    {
        public string Name { get; set; }
        public double Price { get; set; }

        public byte[] Photo { get; set; }
        public int Quantity { get; set; } = 1;
        public int ProductId { get; set; }
    }
}
