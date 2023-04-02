using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IProductRep
    {
        Task<List<Product>> GetAll();
        Task<Product> Get(int id);
        Task<Product> Create(Product shopItem);
        Task<Product> Update (ProductDto shopItem, int id);
        Task Delete (Product shopItem);
        Task<List<Product>> GetSuggestions(int id);
    }
}
