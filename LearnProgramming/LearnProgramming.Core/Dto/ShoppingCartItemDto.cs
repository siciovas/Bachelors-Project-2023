using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Dto
{
    public class ShoppingCartItemDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public Product Product { get; set; }
    }
}
