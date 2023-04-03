using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Dto
{
    public class OrderDto
    {
        public Guid OrderNumber { get; set; }
        public DateTime OrderTime { get; set; }
        public double Total { get; set; }
        public ICollection<OrderItemCollectionDto> OrderItems { get; set; }

    }
}
