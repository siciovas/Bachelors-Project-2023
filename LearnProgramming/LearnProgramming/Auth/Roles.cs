using LearnProgramming.Domain.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;


namespace LearnProgramming.API.Auth
{
    public class Roles : AuthorizeAttribute
    {
        public Roles(AllRoles allRoles)
        {
            Roles = allRoles.ToString();
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;
        }
    }
}
