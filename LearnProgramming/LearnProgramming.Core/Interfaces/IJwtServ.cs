using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IJwtServ
    {
        public string BuildJwt(User user);
    }
}
