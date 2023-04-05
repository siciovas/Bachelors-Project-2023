namespace LearnProgramming.Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public byte[] Photo { get; set; }
        public double Price { get; set; }

        public string Name { get; set; }
        public int Quantity { get; set; } = 1;
        public Order Order  { get; set; }
        public int OrderId { get; set; }
        public Product Product { get; set; }
        public int ProductId { get; set; }
    }
}
