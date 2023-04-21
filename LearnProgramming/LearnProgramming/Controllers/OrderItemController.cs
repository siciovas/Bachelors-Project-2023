using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/order/{orderId}/orderitem")]
    public class OrderItemController : Controller
    {
        private readonly IOrderItemRep _orderItemRep;

        public OrderItemController(IOrderItemRep orderItemRep)
        {
            _orderItemRep = orderItemRep;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<OrderItemDto>>> GetAll(int orderId)
        {
            var orderItem = await _orderItemRep.GetAll(orderId);

            return Ok(orderItem.Select(orderItemDto => new OrderItemDto
            {
                Name = orderItemDto.Name,
                Photo = orderItemDto.Photo,
                Price = orderItemDto.Price,
                Quantity = orderItemDto.Quantity,
                OrderId = orderId,
                ProductId = orderItemDto.ProductId,
            }).ToList());
        }
    }
}
