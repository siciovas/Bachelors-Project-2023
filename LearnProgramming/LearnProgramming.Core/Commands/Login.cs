using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Commands
{
    public class Login
    {
        [Required]
        public string UsernameOrEmail { get; set; } = string.Empty!;
        [Required]
        public string Password { get; set; } = string.Empty!;
    }
}