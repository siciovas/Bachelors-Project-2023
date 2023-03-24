using System.ComponentModel.DataAnnotations;

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