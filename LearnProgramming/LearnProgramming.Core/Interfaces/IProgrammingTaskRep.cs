using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IProgrammingTaskRep
    {
        Task<List<ProgrammingTask>> GetAll(int subTopicId);
        Task<ProgrammingTask?> Get(int id);
        Task<ProgrammingTask> Create(ProgrammingTask programmingTask);
        Task<ProgrammingTask> Update(ProgrammingTask programmingTask);
        Task Delete(ProgrammingTask programmingTask);
    }
}
