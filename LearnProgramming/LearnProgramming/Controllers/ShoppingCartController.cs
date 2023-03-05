using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
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
        public async Task<ActionResult<ShoppingCartDto>> Get()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var shoppingCartItems = await _shoppingCartItem.GetByUserId(userId);

            return new ShoppingCartDto
            {
                ShoppingCartItems = shoppingCartItems.Select(cart => new ShoppingCartItemDto
                {
                    Product = cart.Product,
                    Quantity = cart.Quantity,
                }).ToList(),

                CartPrice = shoppingCartItems.Sum(cart => cart.Product.Price * cart.Quantity),
            };
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var cart = await _shoppingCartItem.GetById(id);
            if (cart == null) return NotFound();

            await _shoppingCartItem.Delete(cart);

            return NoContent();
        }

        [HttpPost]
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
        public async Task<ActionResult<ShippingInformationPostDto>> PostShippingInformation(ShippingInformationPostDto shippingInformation)
        {

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var shippingInfo = await _shippingInformationRep.Get(userId);

            var newShippingInformation = new ShippingInformation
            {
               UserId= userId,
               Name = shippingInformation.Name,
               Surname = shippingInformation.Surname,
               Email = shippingInformation.Email,
               RepeatEmail = shippingInformation.RepeatEmail,
               Address = shippingInformation.Address,
               City = shippingInformation.City,
               PhoneNumber = shippingInformation.PhoneNumber,
               Region = shippingInformation.Region,
               Street = shippingInformation.Street,
               ZipCode = shippingInformation.ZipCode,
            };

            if (shippingInformation.Email != shippingInformation.RepeatEmail)
            {
                return BadRequest();
            } 
            else
            {
                if (shippingInfo != null)
                {
                    shippingInfo.Name = shippingInformation.Name;
                    shippingInfo.Surname = shippingInformation.Surname;
                    shippingInfo.Email = shippingInformation.Email;
                    shippingInfo.RepeatEmail = shippingInformation.RepeatEmail;
                    shippingInfo.Address = shippingInformation.Address;
                    shippingInfo.City = shippingInformation.City;
                    shippingInfo.PhoneNumber = shippingInformation.PhoneNumber;
                    shippingInfo.Region = shippingInformation.Region;
                    shippingInfo.Street = shippingInformation.Street;
                    shippingInfo.ZipCode = shippingInformation.ZipCode;

                    await _shippingInformationRep.Update(shippingInfo);
                }
                else 
                {
                    await _shippingInformationRep.Create(newShippingInformation);
                }

                return Created($"api/shoppingcart/shipping/{newShippingInformation.Id}", _mapper.Map<ShippingInformationPostDto>(newShippingInformation));
            }
        }

    }
}
