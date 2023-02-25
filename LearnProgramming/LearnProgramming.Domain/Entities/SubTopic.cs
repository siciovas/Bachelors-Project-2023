using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class SubTopic
    {
        public int Id { get; set; }
        public string SubTopicName { get; set; } = string.Empty!;
        public LearningTopic LearningTopic { get; set; }
        public int LearningTopicId { get; set; }
        public List<TaskInfo> Tasks { get; set; } = new();



    }
}
