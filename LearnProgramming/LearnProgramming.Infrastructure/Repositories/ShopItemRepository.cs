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
    public class ShopItemRepository : IShopItem
    {
        private readonly DatabaseContext _db;

        public ShopItemRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<ShopItem> Create(ShopItem shopItem)
        {
           _db.ShopItem.Add(shopItem);
            await _db.SaveChangesAsync();

            return shopItem;
        }

        public async Task Delete(ShopItem shopItem)
        {
            _db.ShopItem.Remove(shopItem);
            await _db.SaveChangesAsync();
        }

        public async Task<ShopItem> Get(int id)
        {
            return await _db.ShopItem.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<ShopItem>> GetAll()
        {
            var topics = await _db.ShopItem.ToListAsync();

            return topics;
        }

        public async Task<ShopItem> Update(ShopItem shopItem)
        {
           _db.ShopItem.Update(shopItem);
            await _db.SaveChangesAsync();

            return shopItem;
        }
    }
}
