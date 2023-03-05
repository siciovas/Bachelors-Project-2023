using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IOrderRep
    {
        Task<List<Order>> GetAll(Guid id);
        Task<Order> Create(Order order);
    }
}
