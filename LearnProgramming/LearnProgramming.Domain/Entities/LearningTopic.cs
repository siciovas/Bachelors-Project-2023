using LearnProgramming.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class LearningTopic
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty!;
        public Difficulty DifficultyInText { get; set; }
    }
}
