using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class ProgrammingTaskTest
    {
        public int Id { get; set; }
        public string Input { get; set; }
        public string Output { get; set; }
        public int ProgrammingTaskId { get; set; }
        public ProgrammingTask ProgrammingTask { get; set; }
    }
}
