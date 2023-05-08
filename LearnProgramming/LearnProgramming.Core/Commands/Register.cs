using System.ComponentModel.DataAnnotations;

namespace LearnProgramming.Core.Commands
{
    public class Register
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ]*$", ErrorMessage = "Specialūs simboliai slapyvardžio laukelyje negalimi!")]
        public string UserName { get; set; } = string.Empty!;
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ]*$", ErrorMessage = "Specialūs simboliai vardo laukelyje negalimi!")]
        public string Name { get; set; } = string.Empty!;
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ]*$", ErrorMessage = "Specialūs simboliai pavardės laukelyje negalimi!")]
        public string Surname { get; set; } = string.Empty!;
        [Required]
        public string Email { get; set; } = string.Empty!;
        [Required]
        [MinLength(5, ErrorMessage="Slaptažodis turi būti bent iš 5 simbolių")]
        public string Password { get; set; } = string.Empty!;
        public string Sex { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
    }
}