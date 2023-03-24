using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class ProgrammingTaskRepository : IProgrammingTaskRep
    {
        private readonly DatabaseContext _db;

        public ProgrammingTaskRepository(DatabaseContext db)
        {
            _db = db;
        }
        public async Task<ProgrammingTask> Create(ProgrammingTask programmingTask)
        {
            _db.Add(programmingTask);
            await _db.SaveChangesAsync();
            return programmingTask;
        }

        public async Task Delete(ProgrammingTask programmingTask)
        {
            _db.Remove(programmingTask);
            await _db.SaveChangesAsync();
        }

        public async Task<ProgrammingTask?> Get(int id)
        {
            return await _db.ProgrammingTask.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<ProgrammingTask>> GetAll(int subTopicId)
        {
            return await _db.ProgrammingTask.Where(x => x.SubTopicId == subTopicId).ToListAsync();
        }

        public async Task<ProgrammingTask> Update(ProgrammingTask programmingTask)
        {
            _db.Update(programmingTask);

            await _db.SaveChangesAsync();

            return programmingTask;
        }
    }
}
