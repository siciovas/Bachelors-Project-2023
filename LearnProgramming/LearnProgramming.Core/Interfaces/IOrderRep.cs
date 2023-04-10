using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IOrderRep
    {
        Task<List<Order>> GetByUserId(Guid id);
        Task<Order> Update(Guid orderNumber);

        Task<Order> Create(Order order);
    }
}
