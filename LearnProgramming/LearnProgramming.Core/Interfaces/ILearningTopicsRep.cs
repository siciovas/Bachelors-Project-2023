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
        Task<List<LearningTopics>> GetAll();
        Task<LearningTopics> Get(int id);
        Task<LearningTopics> Create(LearningTopics learningTopics);
        Task<LearningTopics> Update(LearningTopics learningTopics);
        Task Delete(LearningTopics learningTopics);
    }
}
