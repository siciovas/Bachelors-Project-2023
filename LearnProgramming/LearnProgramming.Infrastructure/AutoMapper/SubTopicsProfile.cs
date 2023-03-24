using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class SubTopicsProfile : Profile
    {
        public SubTopicsProfile()
        {
            CreateMap<SubTopic, SubTopicDto>();
            CreateMap<SubTopic, SubTopicPostDto>();
            CreateMap<SubTopic, SubTopicUpdateDto>();
        }
    }
}
