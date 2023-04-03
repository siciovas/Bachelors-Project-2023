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
        public async void Create_OrderItem_ReturnsCorrectData()
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

            await _databaseContext.AddRangeAsync(user, product, order);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(orderItem);

            var expected = await _databaseContext.OrderItem.FirstOrDefaultAsync();

            Assert.Equal(expected!.Name, orderItem.Name);
            Assert.Equal(expected.Quantity, orderItem.Quantity);
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
    }
}
