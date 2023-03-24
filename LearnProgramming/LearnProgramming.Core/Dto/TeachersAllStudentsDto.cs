using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class TeachersAllStudentsDto
    {
        public Guid Id { get; set; }
        public byte[] Avatar { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Surname { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
    }
}
