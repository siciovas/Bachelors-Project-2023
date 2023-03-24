using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface ISubTopicsRep
    {
        Task<List<SubTopicDto>> GetAll(int learningTopicId);
        Task<SubTopic> Get(int id);
        Task<SubTopic> Create(SubTopic subTopic);
        Task<SubTopic> Update(SubTopic subTopic);
        Task Delete(SubTopic subTopic);

    }
}
