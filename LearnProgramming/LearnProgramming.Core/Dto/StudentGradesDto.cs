using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class StudentGradesDto
    {
        public string Topic { get; set; } = null!;
        public string SubTopic { get; set; } = null!;
        public string Task { get; set; } = null!;
        public double Grade { get; set; } 
    }
}
