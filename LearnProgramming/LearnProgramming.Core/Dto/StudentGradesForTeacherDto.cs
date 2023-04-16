using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class StudentGradesForTeacherDto
    {
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public List<StudentGradesDto> Grades { get; set; } = new();
    }
}
