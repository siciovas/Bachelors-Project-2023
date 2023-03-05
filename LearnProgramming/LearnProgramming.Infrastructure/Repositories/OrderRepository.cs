using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRep
    {
        private readonly DatabaseContext _db;

        public OrderRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<Order> Create(Order order)
        {
            _db.Add(order);
            await _db.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetAll(Guid userId)
        {
            return await _db.Order.Where(order => order.UserId == userId).ToListAsync();
        }
    }
}
