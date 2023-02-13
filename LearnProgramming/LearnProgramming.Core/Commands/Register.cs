using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Commands
{
    public class Register
    {
        [Required]
        public string UserName { get; set; } = string.Empty!;
        [Required]
        public string Name { get; set; } = string.Empty!;
        [Required]
        public string Surname { get; set; } = string.Empty!;
        [Required]
        public string Email { get; set; } = string.Empty!;
        [Required]
        [MinLength(5)]
        public string Password { get; set; } = string.Empty!;
        public string Sex { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
    }
}