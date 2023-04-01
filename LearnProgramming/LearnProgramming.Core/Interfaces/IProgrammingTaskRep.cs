using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IProgrammingTaskRep
    {
        Task<List<ProgrammingTask>> GetAll(int subTopicId);
        Task<ProgrammingTask?> Get(int id);
        Task<ProgrammingTask> Create(ProgrammingTask programmingTask);
        Task<ProgrammingTask> Update(ProgrammingTask programmingTask);
        Task Delete(ProgrammingTask programmingTask);
        Task<List<ProgrammingTaskTest>> AddTests(List<ProgrammingTaskTest> tests);
    }
}
