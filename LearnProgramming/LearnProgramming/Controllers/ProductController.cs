using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/shop")]
    public class ProductController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IProductRep _shopItemRep;

        public ProductController(IMapper mapper, IProductRep shopItemRep)
        {
            _mapper = mapper;
            _shopItemRep = shopItemRep;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAll()
        {
            var item = await _shopItemRep.GetAll();

            var itemDto = item.Select(x => _mapper.Map<Product>(x)).ToList();

            return Ok(itemDto);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Product>> Get(int id)
        {
            var item = await _shopItemRep.Get(id);

            if (item == null) return NotFound();

            var itemDto = _mapper.Map<Product>(item);

            return Ok(itemDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> Delete(int id)
        {
            var item = await _shopItemRep.Get(id);
            if (item == null) return NotFound();

            await _shopItemRep.Delete(item);

            return NoContent();
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<ProductDto>> Update(ProductDto itemsDto, int id)
        {
            var item = await _shopItemRep.Get(id);
            if (item == null) return NotFound();

            await _shopItemRep.Update(itemsDto, id);

            return Ok(itemsDto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<ProductDto>> Post(ProductDto itemDto)
        {
            var newItem = new Product
            {
                Photo = itemDto.Photo,
                ReleaseDate = itemDto.ReleaseDate,
                Publisher = itemDto.Publisher,
                BookCoverType = itemDto.BookCoverType,
                Description = itemDto.Description,
                Language = itemDto.Language,
                PageNumber = itemDto.PageNumber,
                Name = itemDto.Name,
                Price = itemDto.Price,
            };

            await _shopItemRep.Create(newItem);

            return Created($"api/shop{newItem.Id}", _mapper.Map<ProductDto>(newItem));
        }

        [HttpGet("suggestions/{id}")]
        public async Task<ActionResult<List<Product>>> GetSuggestions(int id)
        {
            var item = await _shopItemRep.GetSuggestions(id);

            var itemDto = item.Select(x => _mapper.Map<Product>(x)).ToList();

            return Ok(itemDto);
        }
    }
}
