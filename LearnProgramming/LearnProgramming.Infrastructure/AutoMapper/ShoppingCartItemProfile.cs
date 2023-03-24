using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class ShoppingCartItemProfile : Profile
    {
        public ShoppingCartItemProfile()
        {
            CreateMap<ShoppingCartItem, ShoppingCartDto>();
            CreateMap<ShoppingCartItem, ShoppingCartItemPostDto>();

        }
    }

}
