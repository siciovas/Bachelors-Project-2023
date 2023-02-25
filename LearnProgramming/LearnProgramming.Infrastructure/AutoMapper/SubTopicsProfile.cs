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
    public class SubTopicsProfile : Profile
    {
        public SubTopicsProfile()
        {
            CreateMap<SubTopic, SubTopicDto>();
            CreateMap<SubTopic, SubTopicPostDto>();
        }
    }
}
