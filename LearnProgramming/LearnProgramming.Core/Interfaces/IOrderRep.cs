using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IOrderRep
    {
        Task<List<Order>> GetAll(Guid id);
        Task<Order> Create(Order order);
    }
}
