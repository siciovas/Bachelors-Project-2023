using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class SubTopicDto
    {
        public int SubTopicId { get; set; }
        public string SubTopicName { get; set; } = string.Empty!;
        public int NumberOfTasks { get; set; }
    }
}
