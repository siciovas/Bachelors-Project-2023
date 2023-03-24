using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class SubmissionRepository : ISubmissionRep
    {
        private readonly DatabaseContext _db;

        public SubmissionRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<Submission> Create(Submission submission)
        {
            _db.Add(submission);
            await _db.SaveChangesAsync();
            return submission;
        }

        public async Task<List<Submission>> GetById(Guid UserId)
        {
           var submissions = await _db.Submission.Include(submission => submission.User).Where(submission => submission.UserId == UserId).ToListAsync();

            return submissions;
        }

        public async Task<List<Submission>> GetAll()
        {
            var submissions = await _db.Submission.Include(submission => submission.User).ToListAsync();

            return submissions;
        }
    }
}
