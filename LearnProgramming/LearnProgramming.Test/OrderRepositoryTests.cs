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
    public class OrderRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public OrderRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        }

        private OrderRepository CreateRepository()
        {
            return new OrderRepository(_databaseContext);
        }

        [Fact]
        public async void Create_Order_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var order = _fixture.Build<Order>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(order);

            var expected = await _databaseContext.Order.FirstOrDefaultAsync();

            Assert.Equal(expected!.OrderNumber, order.OrderNumber);
            Assert.Equal(expected.Total, order.Total);
            Assert.Equal(expected.UserId, order.UserId);
            Assert.Equal(expected.Id, order.Id);
        }

        [Fact]
        public async void GetAll_Order_ReturnsCorrectData()
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

            var result = await repo.GetAll();

            Assert.Single(result);
            Assert.Equal(order.OrderNumber, result.First().OrderNumber);
            Assert.Equal(order.Total, result.First().Total);
            Assert.Equal(order.UserId, result.First().UserId);
            Assert.Equal(order.OrderItems.First().Name, result.First().OrderItems.First().Name);
            Assert.Equal(order.OrderItems.First().Id, result.First().OrderItems.First().Id);
            Assert.Equal(order.OrderItems.First().OrderId, result.First().OrderItems.First().OrderId);
            Assert.Equal(order.OrderItems.First().ProductId, result.First().OrderItems.First().ProductId);

        }

        [Fact]
        public async void GetByUserId_Order_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();
            var user2 = _fixture.Create<User>();

            var product = _fixture.Create<Product>();
            var product2 = _fixture.Create<Product>();

            var order = _fixture.Build<Order>()
                .With(x => x.UserId, user.Id)
                .With(x => x.IsPaid, true)
                .Without(x => x.User)
                .Without(x => x.OrderItems)
                .Create();
            var order3 = _fixture.Build<Order>()
                .With(x => x.UserId, user.Id)
                .With(x => x.IsPaid, false)
                .Without(x => x.User)
                .Without(x => x.OrderItems)
                .Create();
            var order2 = _fixture.Build<Order>()
                .With(x => x.UserId, user2.Id)
                .With(x => x.IsPaid, true)
                .Without(x => x.User)
                .Without(x => x.OrderItems)
                .Create();

            var orderItem = _fixture.Build<OrderItem>()
                .With(x => x.OrderId, order.Id)
                .With(x => x.ProductId, product.Id)
                .Without(x => x.Order)
                .Without(x => x.Product)
                .Create();
            var orderItem2 = _fixture.Build<OrderItem>()
                .With(x => x.OrderId, order2.Id)
                .With(x => x.ProductId, product2.Id)
                .Without(x => x.Order)
                .Without(x => x.Product)
                .Create();

            await _databaseContext.AddRangeAsync(user, user2, product, product2, order, order2, order3, orderItem, orderItem2);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetByUserId(order.UserId);

            Assert.Single(result);
            Assert.Equal(order.OrderNumber, result.First().OrderNumber);
            Assert.Equal(order.Total, result.First().Total);
            Assert.Equal(order.UserId, result.First().UserId);
            Assert.Equal(order.OrderItems.First().Name, result.First().OrderItems.First().Name);
            Assert.Equal(order.OrderItems.First().Id, result.First().OrderItems.First().Id);
            Assert.Equal(order.OrderItems.First().OrderId, result.First().OrderItems.First().OrderId);
            Assert.Equal(order.OrderItems.First().ProductId, result.First().OrderItems.First().ProductId);

        }
    }
}
