using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class ProductRepository : IProductRep
    {
        private readonly DatabaseContext _db;

        public ProductRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<Product> Create(Product shopItem)
        {
           _db.Product.Add(shopItem);
            await _db.SaveChangesAsync();

            return shopItem;
        }

        public async Task Delete(Product shopItem)
        {
            _db.Product.Remove(shopItem);
            await _db.SaveChangesAsync();
        }

        public async Task<Product> Get(int id)
        {
            return await _db.Product.FirstOrDefaultAsync(shop => shop.Id == id);
        }

        public async Task<List<Product>> GetAll()
        {
            var topics = await _db.Product.ToListAsync();

            return topics;
        }

        public async Task<List<Product>> GetSuggestions(int id)
        {
            Random rand = new Random();
            int count = await _db.Product.CountAsync();

            if(count < 4)
            {
                return await _db.Product.Where(x => x.Id != id).ToListAsync();
            }

            int skipper = rand.Next(0, count - 3);

            return await _db.Product.Where(x => x.Id != id).Skip(skipper).Take(3).ToListAsync();
        }

        public async Task<Product> Update(Product shopItem)
        {
           _db.Product.Update(shopItem);
            await _db.SaveChangesAsync();

            return shopItem;
        }
    }
}
