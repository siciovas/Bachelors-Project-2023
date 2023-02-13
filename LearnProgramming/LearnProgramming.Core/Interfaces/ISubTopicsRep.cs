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
        Task<List<SubTopics>> GetAll(int learningTopicId);
        Task<SubTopics> Get(int id);
        Task<SubTopics> Create(SubTopics subTopics);
        Task<SubTopics> Update(SubTopics subTopics);
        Task Delete(SubTopics subTopics);
    }
}
