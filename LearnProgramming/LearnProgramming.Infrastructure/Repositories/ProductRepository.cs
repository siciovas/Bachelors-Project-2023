using LearnProgramming.Core.Dto;
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
                return await _db.Product.Where(x => x.Id != id).Take(2).ToListAsync();
            }

            int skipper = rand.Next(0, count - 3);

            return await _db.Product.Where(x => x.Id != id).Skip(skipper).Take(3).ToListAsync();
        }

        public async Task<Product> Update(ProductDto shopItem, int id)
        {
            var product = await _db.Product.AsTracking().FirstAsync(x => x.Id == id);

            product.Photo = shopItem.Photo;
            product.Name = shopItem.Name;
            product.Description = shopItem.Description;
            product.Price = shopItem.Price;
            product.PageNumber = shopItem.PageNumber;
            product.Language = shopItem.Language;
            product.BookCoverType = shopItem.BookCoverType;
            product.Publisher = shopItem.Publisher;
            product.ReleaseDate = shopItem.ReleaseDate;

            await _db.SaveChangesAsync();

            return product;
        }
    }
}
