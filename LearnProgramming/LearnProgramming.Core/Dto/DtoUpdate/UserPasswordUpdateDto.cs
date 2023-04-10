namespace LearnProgramming.Core.Dto.DtoUpdate
{
    public class UserPasswordUpdateDto
    {
        public byte[] PasswordSalt { get; set; }
        public byte[] PasswordHash { get; set; }
    }
}
