using AutoFixture;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Xunit;

namespace LearnProgramming.Test
{
    public class OrderItemRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public OrderItemRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        }

        private OrderItemRepository CreateRepository()
        {
            return new OrderItemRepository(_databaseContext);
        }

        [Fact]
        public async void GetAll_OrderItem_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var product = _fixture.Create<Product>();

            var order = _fixture.Build<Order>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Without(x => x.OrderItems)
                .Create();

            var orderItem = _fixture.Build<OrderItem>()
                .With(x => x.OrderId, order.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.Order)
                .Without(x => x.Product)
                .Create();

            await _databaseContext.AddRangeAsync(user, product, order, orderItem);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll(orderItem.OrderId);

            Assert.Single(result);
            Assert.Equal(orderItem.Name, result.First().Name);
            Assert.Equal(orderItem.Quantity, result.First().Quantity);
        }

        [Fact]
        public async void Create_OrderItems_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var product = _fixture.Create<Product>();

            var order = _fixture.Build<Order>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Without(x => x.OrderItems)
                .Create();

            var orderItem = _fixture.Build<OrderItem>()
                .With(x => x.OrderId, order.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.Order)
                .Without(x => x.Product)
                .CreateMany(1)
                .ToList();

            await _databaseContext.AddRangeAsync(user, product, order);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(orderItem);

            var expected = await _databaseContext.OrderItem.FirstOrDefaultAsync();

            Assert.Equal(expected!.Id, orderItem[0].Id);
            Assert.Equal(expected.Name, orderItem[0].Name);
            Assert.Equal(expected.Price, orderItem[0].Price);
            Assert.Equal(expected.Quantity, orderItem[0].Quantity);
            Assert.Equal(expected.Photo, orderItem[0].Photo);
        }
    }
}
