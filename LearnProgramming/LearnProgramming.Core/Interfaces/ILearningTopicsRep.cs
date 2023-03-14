using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface ILearningTopicsRep
    {
        Task<List<LearningTopicsDto>> GetAll();
        Task<LearningTopic> Get(int id);
        Task<LearningTopic> Create(LearningTopic learningTopics);
        Task<LearningTopic> Update(LearningTopic learningTopics);
        Task Delete(LearningTopic learningTopics);
    }
}
