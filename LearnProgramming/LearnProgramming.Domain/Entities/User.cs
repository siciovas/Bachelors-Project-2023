using LearnProgramming.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class User
    {
        // User information
        public Guid Id { get; set; }
        public byte[] Avatar { get; set; } = Array.Empty<byte>();
        public string UserName { get; set; } = string.Empty!;
        public string Name { get; set; } = string.Empty!;
        public string Surname { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string City { get; set; }
        public string School { get; set; }
        public AllRoles Role { get; set; } = AllRoles.Student;

    }
}
