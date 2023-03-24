using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class ProgrammingTask : Profile
    {
        public ProgrammingTask()
        {
            CreateMap<Domain.Entities.ProgrammingTask, ProgrammingTaskDto>();
            CreateMap<Domain.Entities.ProgrammingTask, ProgrammingTaskPostDto>();
        }
    }
}
