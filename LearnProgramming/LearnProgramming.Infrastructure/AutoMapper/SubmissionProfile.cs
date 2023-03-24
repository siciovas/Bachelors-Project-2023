using AutoMapper;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class SubmissionProfile : Profile
    {
        public SubmissionProfile()
        {
            CreateMap<Submission, SubmissionDto>();
            CreateMap<Submission, SubmissionPostDto>();
            CreateMap<Submission, SubmissionUserDto>();
        }
    }
}
