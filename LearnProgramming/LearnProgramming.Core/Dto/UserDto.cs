using LearnProgramming.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class UserDto
    {
        public byte[] Avatar { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Surname { get; set; } = string.Empty!;
        public string UserName { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
        public string City { get; set; } = string.Empty!;
        public string School { get; set; } = string.Empty!;

    }
}
