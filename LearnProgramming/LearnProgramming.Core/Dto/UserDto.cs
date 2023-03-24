namespace LearnProgramming.Core.Dto
{
    public abstract class UserDto
    {
        public Guid Id { get; set; }
        public byte[] Avatar { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Surname { get; set; } = string.Empty!;
        public string UserName { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
        public string City { get; set; } = string.Empty!;
        public string School { get; set; } = string.Empty!;
    }
}
