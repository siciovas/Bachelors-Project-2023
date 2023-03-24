using LearnProgramming.Domain.Entities;

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
