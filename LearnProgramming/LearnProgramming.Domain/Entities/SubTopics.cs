using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class SubTopics
    {
        public int Id { get; set; }
        public string SubTopicName { get; set; } = string.Empty!;
        public LearningTopics LearningTopics { get; set; }



    }
}
