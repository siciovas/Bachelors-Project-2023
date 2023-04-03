namespace LearnProgramming.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public User User { get; set; }
        public Guid UserId { get; set; }
        public Guid OrderNumber { get; set; }
        public DateTime OrderTime { get; set; }
        public double Total { get; set; }
        public bool IsPaid { get; set; } = false;

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
