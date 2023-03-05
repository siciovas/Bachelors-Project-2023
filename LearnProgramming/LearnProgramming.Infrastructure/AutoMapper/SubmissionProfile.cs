using AutoMapper;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Core.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
