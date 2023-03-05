using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IOrderItemRep
    {
        Task<List<OrderItem>> GetAll(int orderId);
        Task<OrderItem> Get(int id, int orderId);
        Task<OrderItem> Create(OrderItem orderItem);
    }
}
