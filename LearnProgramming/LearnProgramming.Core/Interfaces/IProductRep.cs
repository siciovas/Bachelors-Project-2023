using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IProductRep
    {
        Task<List<Product>> GetAll();
        Task<Product> Get(int id);
        Task<Product> Create(Product shopItem);
        Task<Product> Update (Product shopItem);
        Task Delete (Product shopItem);
        Task<List<Product>> GetSuggestions();
    }
}
