using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IShoppingCartItemRep
    {
        Task<List<ShoppingCartItem>> GetByUserId(Guid UserId);
        Task<ShoppingCartItem> GetById(int id);
        Task<ShoppingCartItem> Create(ShoppingCartItem shoppingCart);
        Task Delete(ShoppingCartItem shoppingCart);
    }
}
