using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IShopItem
    {
        Task<List<ShopItem>> GetAll();
        Task<ShopItem> Get(int id);
        Task<ShopItem> Create(ShopItem shopItem);
        Task<ShopItem> Update (ShopItem shopItem);
        Task Delete (ShopItem shopItem);
    }
}
