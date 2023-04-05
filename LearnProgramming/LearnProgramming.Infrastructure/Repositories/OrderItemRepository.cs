using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class OrderItemRepository : IOrderItemRep
    {
        private readonly DatabaseContext _db;

        public OrderItemRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<List<OrderItem>> Create(List<OrderItem> orderItems)
        {
            _db.AddRange(orderItems);
            await _db.SaveChangesAsync();

            return orderItems;
        }

        public async Task<List<OrderItem>> GetAll(int orderId)
        {
            return await _db.OrderItem
                .Where(x => x.OrderId == orderId)
                .ToListAsync();

        }
    }
}
