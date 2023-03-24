namespace LearnProgramming.Core.Interfaces
{
    public record HashPasswordResponse(byte[] PasswordHash, byte[] PasswordSalt);

    public interface IHashServ
    {
        HashPasswordResponse HashPassword(string password);
        bool VerifyPassword(string password, byte[] hash, byte[] salt);
    }

}
