using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class LearningTopicsProfile : Profile
    {
        public LearningTopicsProfile()
        {
            CreateMap<LearningTopic, LearningTopicsDto>();
            CreateMap<LearningTopic, LearningTopicsPostDto>();
        }
    }
}
