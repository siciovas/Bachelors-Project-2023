using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface ISubmissionRep
    {
        Task<List<Submission>> GetById(Guid UserId);
        Task<Submission> Create(Submission submission);
        Task<List<Submission>> GetAll();
    }
}
