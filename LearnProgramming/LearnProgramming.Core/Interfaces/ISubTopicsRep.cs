using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface ISubTopicsRep
    {
        Task<List<SubTopic>> GetAll(int learningTopicId);
        Task<SubTopic> Get(int id, int topicId);
        Task<SubTopic> Create(SubTopic subTopic);
        Task<SubTopic> Update(SubTopic subTopic);
        Task Delete(SubTopic subTopic);
    }
}
