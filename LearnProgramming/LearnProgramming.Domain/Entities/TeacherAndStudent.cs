using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class TeacherAndStudent
    {
        public int Id { get; set; }
        public Guid TeacherId { get; set; }
        public Guid StudentId { get; set; }
    }
}