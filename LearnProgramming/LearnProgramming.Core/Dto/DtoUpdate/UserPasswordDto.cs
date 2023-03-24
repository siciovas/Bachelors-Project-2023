namespace LearnProgramming.Core.Dto.DtoUpdate
{
    public class UserPasswordDto
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string RepeatPassword { get; set; }
    }
}
