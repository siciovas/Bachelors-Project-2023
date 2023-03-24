using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface ISubmissionRep
    {
        Task<List<Submission>> GetById(Guid UserId);
        Task<Submission> Create(Submission submission);
        Task<List<Submission>> GetAll();
    }
}
