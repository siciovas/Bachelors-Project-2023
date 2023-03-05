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
    public class OrderItemRepository : IOrderItemRep
    {
        private readonly DatabaseContext _db;

        public OrderItemRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<OrderItem> Create(OrderItem orderItem)
        {
            _db.Add(orderItem);
            await _db.SaveChangesAsync();

            return orderItem;
        }

        public async Task<OrderItem> Get(int id, int orderId)
        {
            return await _db.OrderItem.Where(x => x.Id == id && x.OrderId == orderId).FirstOrDefaultAsync();

        }

        public async Task<List<OrderItem>> GetAll(int orderId)
        {
            return await _db.OrderItem.Where(x => x.OrderId == orderId).ToListAsync();

        }
    }
}
