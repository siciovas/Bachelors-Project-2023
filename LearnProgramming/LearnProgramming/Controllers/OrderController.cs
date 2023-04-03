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
        private readonly IMapper _mapper;

        public OrderController(IOrderRep orderRep, IMapper mapper)
        {
            _mapper = mapper;
            _orderRep = orderRep;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<OrderDto>>> GetAll()
        {
            var orders = await _orderRep.GetAll();

            return Ok(orders.Select(order => new OrderDto
            {
                OrderNumber = order.OrderNumber,
                OrderTime = order.OrderTime,
                Total = order.Total,
                OrderItems = order.OrderItems.Select(orderItem => new OrderItemCollectionDto
                {
                    Name = orderItem.Name,
                    Quantity = orderItem.Quantity,
                    ProductId = orderItem.ProductId,
                }).ToList()
            }).ToList());
        }

        [HttpGet]
        [Authorize]
        [Route("/getByUserId")]
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
                    Name = orderItem.Name,
                    Quantity = orderItem.Quantity,
                    ProductId = orderItem.ProductId,
                }).ToList()
            }).ToList());
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<OrderDto>> Post(OrderDto order)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var newOrder = new Order
            {
                UserId = userId,
                OrderNumber = order.OrderNumber,
                OrderTime = order.OrderTime,
                Total = order.Total,
            };

            await _orderRep.Create(newOrder);

            return Created($"api/{newOrder.Id}", _mapper.Map<OrderDto>(newOrder));
        }
    }
}

/*int projectId = 236200;
string signPassword = "0afd133fdc22d2f091b7d43ad4c46eaa";
Client client = new Client(projectId, signPassword);
var request = client.NewMacroRequest();
request.OrderId = "ORDER0001";
request.Amount = 1000;
request.Currency = "EUR";
request.Country = "LT";
request.Test = true;
request.AcceptUrl = "https://google.com";
request.CancelUrl = "https://google.com";
request.CallbackUrl = "https://google.com";
string redirectUrl = client.BuildRequestUrl(request);*/
