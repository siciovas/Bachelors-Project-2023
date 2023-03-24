using AutoMapper;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class ShippingInformationProfile : Profile
    {
        public ShippingInformationProfile()
        {
            CreateMap<ShippingInformation, ShippingInformationPostDto>();
        }
    }
}
