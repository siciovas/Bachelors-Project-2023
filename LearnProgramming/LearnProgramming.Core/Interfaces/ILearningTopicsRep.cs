using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface ILearningTopicsRep
    {
        Task<List<LearningTopicsDto>> GetAllByTeacher(Guid teacherId);
        Task<List<LearningTopicsDto>> GetAllByStudent(Guid studentId);
        Task<LearningTopic> Get(int id);
        Task<LearningTopic> Create(LearningTopic learningTopics);
        Task<LearningTopic> Update(LearningTopicsDto learningTopics, int id);
        Task Delete(LearningTopic learningTopics);
    }
}
