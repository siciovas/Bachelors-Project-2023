using AutoFixture;
using LearnProgramming.API.Controllers;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace LearnProgramming.Test
{
    public class OrderItemControllerTests
    {
        private readonly Mock<IOrderItemRep> _orderItemRep;
        private readonly Fixture _fixture;

        public OrderItemControllerTests()
        {
            _orderItemRep = new Mock<IOrderItemRep>();
            _fixture = new Fixture();
            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        public OrderItemController CreateController()
        {
            return new OrderItemController(
                _orderItemRep.Object
                );
        }

        [Fact]
        public async void Test_GetAll()
        {
            var orderId = _fixture.Create<int>();
            var orderItems = _fixture.CreateMany<OrderItem>(1).ToList();
            _orderItemRep.Setup(x => x.GetAll(It.IsAny<int>()))
                .ReturnsAsync(orderItems);

            var controller = CreateController();

            var result = await controller.GetAll(orderId);

            var requestResult = (OkObjectResult)result.Result!;

            var objectResult = (List<OrderItemDto>)requestResult.Value!;

            var expected = orderItems.First();

            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
            _orderItemRep.Verify(x => x.GetAll(It.Is<int>(id => id == orderId)),
                Times.Once);
            Assert.Equal(orderItems.Count, objectResult.Count);
            Assert.Equal(expected.Name, objectResult[0].Name);
            Assert.Equal(expected.Quantity, objectResult[0].Quantity);
            Assert.Equal(expected.Price, objectResult[0].Price);
            Assert.Equal(expected.Photo, objectResult[0].Photo);
            Assert.Equal(orderId, objectResult[0].OrderId);
            Assert.Equal(expected.ProductId, objectResult[0].ProductId);
        }
    }
}
