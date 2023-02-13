using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class TaskInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Description { get; set; } = string.Empty!;
        public string DataAndAnswers { get; set; } = string.Empty!;
        public byte[] AdditionalInformacionFile { get; set; }
        public SubTopics SubTopics { get; set; }

    }
}
