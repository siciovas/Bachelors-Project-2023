using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/shop")]
    public class ShopItemController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IShopItem _shopItemRep;

        public ShopItemController(IMapper mapper, IShopItem shopItemRep)
        {
            _mapper = mapper;
            _shopItemRep = shopItemRep;
        }

        [HttpGet]
        public async Task<ActionResult<List<ShopItem>>> GetAll()
        {
            var item = await _shopItemRep.GetAll();

            var itemDto = item.Select(x => _mapper.Map<ShopItem>(x)).ToList();

            return Ok(itemDto);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<ShopItem>> Get(int id)
        {
            var item = await _shopItemRep.Get(id);

            if (item == null) return NotFound();

            var itemDto = _mapper.Map<ShopItem>(item);

            return Ok(itemDto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ShopItem>> Delete(int id)
        {
            var item = await _shopItemRep.Get(id);
            if (item == null) return NotFound();

            await _shopItemRep.Delete(item);

            return NoContent();
        }

        [HttpPut]
        public async Task<ActionResult<ShopItemDto>> Update(ShopItemDto itemsDto, int id)
        {
            var item = await _shopItemRep.Get(id);
            if (item == null) return NotFound();

            item.Photo = itemsDto.Photo;
            item.Name = itemsDto.Name;
            item.Description = itemsDto.Description;
            item.Price = itemsDto.Price;
            item.PageNumber = itemsDto.PageNumber;
            item.Language = itemsDto.Language;
            item.BookCoverType = itemsDto.BookCoverType;
            item.Publisher = itemsDto.Publisher;
            item.ReleaseDate = itemsDto.ReleaseDate;

            await _shopItemRep.Update(item);

            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ShopItemDto>> Post(ShopItemDto itemDto)
        {
            var newTopic = new ShopItem
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

            await _shopItemRep.Create(newTopic);

            return Ok(newTopic);
        }
    }
}
