using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
