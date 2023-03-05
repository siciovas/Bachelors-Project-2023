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
    public class ShoppingCartItemRepository : IShoppingCartItemRep
    {
        private readonly DatabaseContext _db;

        public ShoppingCartItemRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<ShoppingCartItem> Create(ShoppingCartItem shoppingCart)
        {
            _db.Add(shoppingCart);
            await _db.SaveChangesAsync();

            return shoppingCart;
        }

        public async Task Delete(ShoppingCartItem shoppingCart)
        {
            _db.ShoppingCartItems.Remove(shoppingCart);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ShoppingCartItem>> GetByUserId(Guid UserId)
        {
            return await _db.ShoppingCartItems.Include(product => product.Product).Where(user => user.UserId == UserId).ToListAsync();
        }

        public async Task<ShoppingCartItem> GetById(int id)
        {
            return await _db.ShoppingCartItems.Where(cart => cart.Id == id).FirstOrDefaultAsync();
        }

    }
}
