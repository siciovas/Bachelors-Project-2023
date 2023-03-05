using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<SubTopic?> Get(int id, int topicId)
        {
            return await _db.SubTopics.Where(subtopic => subtopic.Id == id && subtopic.LearningTopicId == topicId).FirstOrDefaultAsync();     
        }

        public async Task<List<SubTopic>> GetAll(int learningTopicId)
        {
            return await _db.SubTopics.Where(subtopic => subtopic.LearningTopicId == learningTopicId).ToListAsync();
        }

        public async Task<SubTopic> Update(SubTopic subTopic)
        {
            _db.Update(subTopic);
            await _db.SaveChangesAsync();

            return subTopic;
        }
    }
}
