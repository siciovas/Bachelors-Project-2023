using LearnProgramming.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class LearningTopicsDto
    {
        public byte[] Photo { get; set; }
        public string Title { get; set; }
        public int NumberOfSubTopics { get; set; }
        public int NumberOfAllTasks { get; set; }
        public Difficulty DifficultyInText { get; set; }
        public int DifficultyInStars { get; set; }
    }
}
