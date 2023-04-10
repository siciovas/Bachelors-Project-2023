using AutoMapper;
using LearnProgramming.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LearnProgramming.Domain.Entities;
using System.Security.Claims;
using LearnProgramming.Core.Dto;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : Controller
    {
        private readonly IOrderRep _orderRep;
        private readonly IOrderItemRep _itemRep;
        private readonly IMapper _mapper;

        public OrderController(IOrderRep orderRep, IMapper mapper, IOrderItemRep itemRep)
        {
            _mapper = mapper;
            _orderRep = orderRep;
            _itemRep = itemRep;
        }

        [HttpGet]
        [Authorize]
        [Route("getByUserId")]
        public async Task<ActionResult<List<OrderDto>>> GetByUserId()
        {
            var orders = await _orderRep.GetByUserId(Guid.Parse(User.FindFirstValue(ClaimTypes.Sid)));

            return Ok(orders.Select(orderDto => new OrderDto
            {
                OrderNumber = orderDto.OrderNumber,
                OrderTime = orderDto.OrderTime,
                Total = orderDto.Total,
                OrderItems = orderDto.OrderItems.Select(orderItem => new OrderItemCollectionDto
                {
                    Photo = orderItem.Photo,
                    Price = orderItem.Price,
                    Name = orderItem.Name,
                    ProductId = orderItem.ProductId,
                }).ToList()
            }).ToList());
        }

        [HttpPut]
        [Route("{orderNumber}")]
        [Authorize]
        public async Task<ActionResult<Order>> Update(string orderNumber)
        {
            var order = await _orderRep.Update(Guid.Parse(orderNumber));

            return Ok(order);
        }
    }
}
