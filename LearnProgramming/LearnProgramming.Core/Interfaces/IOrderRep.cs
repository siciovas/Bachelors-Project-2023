using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IOrderRep
    {
        Task<List<Order>> GetAll();
        Task<List<Order>> GetByUserId(Guid id);
        Task<Order> Create(Order order);
    }
}
