using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Infrastructure.AutoMapper
{
    public class StudentGradesProfile : Profile
    {
        public StudentGradesProfile()
        {
            CreateMap<StudentGrades, StudentGradesDto>()
                .ForMember(x => x.Topic, sd => sd.MapFrom(map => map.ProgrammingTask.LearningTopic.Title))
                .ForMember(x => x.SubTopic, sd => sd.MapFrom(map => map.ProgrammingTask.SubTopic.SubTopicName))
                .ForMember(x => x.Task, sd => sd.MapFrom(map => map.ProgrammingTask.Name))
                .ForMember(x => x.Grade, sd => sd.MapFrom(map => map.Grade));

            CreateMap<StudentGrades, StudentGradesPostDto>();
                
        }
    }
}
