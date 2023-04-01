using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class SubTopicsRepository : ISubTopicsRep
    {
        private readonly DatabaseContext _db;

        public SubTopicsRepository(DatabaseContext db)
        {
            _db = db;
        }
        public async Task<SubTopic> Create(SubTopic subTopic)
        {
            _db.Add(subTopic);
            await _db.SaveChangesAsync();

            return subTopic;
        }

        public async Task Delete(SubTopic subTopic)
        {
            _db.SubTopics.Remove(subTopic);
            await _db.SaveChangesAsync();
        }

        public async Task<SubTopic?> Get(int id)
        {
            return await _db.SubTopics.Where(subtopic => subtopic.Id == id).FirstOrDefaultAsync();     
        }

        public async Task<List<SubTopicDto>> GetAll(int learningTopicId)
        {
            var subTopics = await _db.SubTopics
                 .Where(subtopic => subtopic.LearningTopicId == learningTopicId)
                 .Select(x => new SubTopicDto
                 {
                     Id = x.Id,
                     SubTopicName = x.SubTopicName,
                     NumberOfTasks = _db.ProgrammingTasks.Count(y => y.SubTopicId == x.Id),
                 })
                 .ToListAsync();

            return subTopics;
        }

        public async Task<SubTopic> Update(SubTopicUpdateDto subTopic, int id)
        {
            var sub = await _db.SubTopics.AsTracking().FirstAsync(x => x.Id == id);

            sub.SubTopicName = subTopic.SubTopicName;

            await _db.SaveChangesAsync();

            return sub;
        }
    }
}
