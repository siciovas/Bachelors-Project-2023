using LearnProgramming.Core.Dto;
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
            return await _db.ProgrammingTasks
                .Include(topic => topic.LearningTopic)
                .Include(subtopic => subtopic.SubTopic)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<ProgrammingTask>> GetAll(int subTopicId)
        {
            return await _db.ProgrammingTasks
                .Where(x => x.SubTopicId == subTopicId)
                .ToListAsync();
        }

        public async Task<ProgrammingTask> Update(ProgrammingTaskDto programmingTaskDto, int id)
        {
            var programmingTask = await _db.ProgrammingTasks
                .AsTracking()
                .FirstAsync(x => x.Id == id);

            programmingTask.Name = programmingTaskDto.Name;
            programmingTask.Description = programmingTaskDto.Description;

            await _db.SaveChangesAsync();

            return programmingTask;
        }

        public async Task<List<ProgrammingTaskTest>> AddTests(List<ProgrammingTaskTest> tests)
        {
            _db.ProgrammingTaskTests.AddRange(tests);
            await _db.SaveChangesAsync();

            return tests;
        }
    }
}
