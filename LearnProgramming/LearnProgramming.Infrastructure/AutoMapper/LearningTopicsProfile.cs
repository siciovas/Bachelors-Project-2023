using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class LearningTopicsProfile : Profile
    {
        public LearningTopicsProfile()
        {
            CreateMap<LearningTopics, LearningTopicsDto>();
        }
    }
}
