using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/shoppingcart")]
    public class ShoppingCartController : Controller
    {
        private readonly IShoppingCartItemRep _shoppingCartItem;
        private readonly IShippingInformationRep _shippingInformationRep;
        private readonly IMapper _mapper;

        public ShoppingCartController(IMapper mapper, IShoppingCartItemRep shoppingCartItem, IShippingInformationRep shippingInformation)
        {
            _mapper = mapper;
            _shoppingCartItem = shoppingCartItem;
            _shippingInformationRep = shippingInformation;
        }
        
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ShoppingCartDto>> Get()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var shoppingCartItems = await _shoppingCartItem.GetByUserId(userId);

            return new ShoppingCartDto
            {
                ShoppingCartItems = shoppingCartItems.Select(cart => new ShoppingCartItemDto
                {
                    Id = cart.Id,
                    Product = cart.Product,
                    Quantity = cart.Quantity,
                }).ToList(),

                CartPrice = shoppingCartItems.Sum(cart => cart.Product.Price * cart.Quantity),
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            var cart = await _shoppingCartItem.GetById(id);
            if (cart == null) return NotFound();

            await _shoppingCartItem.Delete(cart);

            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ShoppingCartItemPostDto>> Post(ShoppingCartItemPostDto shoppingCart)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var cart = new ShoppingCartItem
            {
                ProductId = shoppingCart.ProductId,
                UserId = userId,
            };

            await _shoppingCartItem.Create(cart);

            return Created($"api/shoppingcart/{cart.Id}", _mapper.Map<ShoppingCartItemPostDto>(cart));
        }

        [HttpPost]
        [Route("shipping")]
        [Authorize]
        public async Task<ActionResult<ShippingInformationPostDto>> PostShippingInformation(ShippingInformationPostDto shippingInformation)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var newShippingInformation = new ShippingInformation
            {
               UserId= userId,
               Name = shippingInformation.Name,
               Surname = shippingInformation.Surname,
               Email = shippingInformation.Email,
               RepeatEmail = shippingInformation.RepeatEmail,
               Address = shippingInformation.Address,
               City = shippingInformation.City,
               Region = shippingInformation.Region,
               Street = shippingInformation.Street,
               ZipCode = shippingInformation.ZipCode,
            };

            if (shippingInformation.Email != shippingInformation.RepeatEmail)
            {
                return BadRequest();
            }
            
            await _shippingInformationRep.Create(newShippingInformation);

            return Created($"api/shoppingcart/shipping/{newShippingInformation.Id}", _mapper.Map<ShippingInformationPostDto>(newShippingInformation));
        }

        [HttpPut]
        [Route("shipping")]
        [Authorize]
        public async Task<ActionResult<ShippingInformationPostDto>> UpdateShippingInformation(ShippingInformationPostDto shippingInformation)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            if (shippingInformation.Email != shippingInformation.RepeatEmail)
            {
                return BadRequest();
            }

            await _shippingInformationRep.Update(shippingInformation, userId);

            return Ok(shippingInformation);
        }

        [HttpGet]
        [Route("shipping")]
        [Authorize]
        public async Task<ActionResult<ShippingInformationDto?>> GetInformation()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var shippingInformation = await _shippingInformationRep.Get(userId);

            if (shippingInformation == null)
            {
                return NotFound();
            }

            return Ok(new ShippingInformationDto
            {
                Name = shippingInformation.Name,
                Surname = shippingInformation.Surname,
                Email = shippingInformation.Email,
                ZipCode = shippingInformation.ZipCode,
                Address = shippingInformation.Address,
                City = shippingInformation.City,
                Region = shippingInformation.Region,
                RepeatEmail = shippingInformation.RepeatEmail,
                Street = shippingInformation.Street,
                Id = shippingInformation.Id,
            });
        }
    }
}
