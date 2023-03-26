using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoUpdate;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserStatusDto>();
            CreateMap<User, UserAvatarDto>();
            CreateMap<User, UserPasswordDto>();
            CreateMap<User, MeDto>();
            CreateMap<User, StudentDto>();
            CreateMap<User, UserStatusDto>();
        }
    }
}
