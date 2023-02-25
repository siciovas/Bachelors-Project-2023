using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IShopRep
    {
        Task<List<Shop>> GetAll();
        Task<Shop> Get(int id);
        Task<Shop> Create(Shop shopItem);
        Task<Shop> Update (Shop shopItem);
        Task Delete (Shop shopItem);
    }
}
