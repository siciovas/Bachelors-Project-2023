using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/order/{orderId}/orderitem")]
    public class OrderItemController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IOrderItemRep _orderItemRep;

        public OrderItemController(IOrderItemRep orderItemRep, IMapper mapper)
        {
            _mapper = mapper;
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
                Quantity = orderItemDto.Quantity,
                OrderId = orderId,
                ProductId = orderItemDto.ProductId,
            }).ToList());
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<OrderItemPostDto>> Post(OrderItemPostDto orderItem, int orderId)
        {
            var newOrderItem = new OrderItem
            {
                Name = orderItem.Name,
                OrderId = orderId,
                ProductId = orderItem.ProductId,
                Quantity = orderItem.Quantity,
            };

            await _orderItemRep.Create(newOrderItem);

            return Created($"api/order/{newOrderItem.OrderId}/orderitem/{newOrderItem.Id}", _mapper.Map<OrderItemPostDto>(newOrderItem));
        }
    }
}
