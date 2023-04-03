using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class OrderItemProfile : Profile
    {
        public OrderItemProfile()
        {
            CreateMap<OrderItem, OrderItemDto>();
            CreateMap<OrderItem, OrderItemPostDto>();
            CreateMap<OrderItem, OrderItemCollectionDto>();
        }
    }
}
