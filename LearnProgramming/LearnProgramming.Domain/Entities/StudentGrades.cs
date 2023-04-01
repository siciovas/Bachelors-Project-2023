using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class StudentGrades
    {
        public Guid Id { get; set; }
        public int Grade { get; set; }
        public int ProgrammingTaskId { get; set; }
        public ProgrammingTask ProgrammingTask { get; set; }
    }
}
