using LearnProgramming.Domain.Enums;

namespace LearnProgramming.Core.Dto
{
    public record AuthDto(string AccessToken, AllRoles Role);
}
