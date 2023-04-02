using AutoFixture;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace LearnProgramming.Test
{
    public class ShoppingCartItemRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public ShoppingCartItemRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private ShoppingCartItemRepository CreateRepository()
        {
            return new ShoppingCartItemRepository(_databaseContext);
        }

        [Fact]
        public async void Create_CreatesShippingCartItem_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var product = _fixture.Create<Product>();

            var cartItem = _fixture.Build<ShoppingCartItem>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.User)
                .Without(x => x.Product)
                .Create();

            await _databaseContext.AddRangeAsync(user, product);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(cartItem);

            var expected = await _databaseContext.ShoppingCartItems.FirstAsync();

            Assert.Equal(expected.Quantity, cartItem.Quantity);
            Assert.Equal(expected.UserId, cartItem.UserId);
            Assert.Equal(expected.ProductId, cartItem.ProductId);
        }

        [Fact]
        public async void Delete_DeleteShoppingCartItem_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var product = _fixture.Create<Product>();

            var cartItem = _fixture.Build<ShoppingCartItem>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.User)
                .Without(x => x.Product)
                .Create();

            await _databaseContext.AddAsync(cartItem);
            await _databaseContext.SaveChangesAsync();

            await repo.Delete(cartItem);

            var expected = await _databaseContext.ShoppingCartItems.FirstOrDefaultAsync();

            Assert.Null(expected);
        }

        [Fact]
        public async void GetById_UserShoppingCartItem_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var product = _fixture.Create<Product>();

            var cartItem = _fixture.Build<ShoppingCartItem>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.User)
                .Without(x => x.Product)
                .Create();

            await _databaseContext.AddRangeAsync(cartItem, product);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetByUserId(cartItem.UserId);

            Assert.Equal(cartItem.Quantity, result[0].Quantity);
            Assert.Equal(cartItem.UserId, result[0].UserId);
            Assert.Equal(cartItem.ProductId, result[0].ProductId);
        }

        [Fact]
        public async void GetById_ShoppingCartItemById_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var product = _fixture.Create<Product>();

            var cartItem = _fixture.Build<ShoppingCartItem>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.User)
                .Without(x => x.Product)
                .Create();

            await _databaseContext.AddRangeAsync(cartItem, product);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetById(cartItem.Id);

            Assert.Equal(cartItem.Quantity, result.Quantity);
            Assert.Equal(cartItem.UserId, result.UserId);
            Assert.Equal(cartItem.ProductId, result.ProductId);
        }
    }
}
