using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Settings;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;

namespace LearnProgramming.Infrastructure.Services
{
    public class JwtService : IJwtServ
    {
        private readonly JwtSettings _jwtSettings;
        private const string Hash = SecurityAlgorithms.HmacSha256Signature;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;
        private readonly SymmetricSecurityKey _symmetricSecurityKey;

        public JwtService(JwtSettings jwtSettings)
        {
            _jwtSettings = jwtSettings;
            _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            _symmetricSecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret));
        }

        public string BuildJwt(User user)
        {
            var tokenDescriptor = CreateAccessTokenDescriptor(user);
            var securityToken = _jwtSecurityTokenHandler.CreateToken(tokenDescriptor);

            return _jwtSecurityTokenHandler.WriteToken(securityToken);
        }

        private SecurityTokenDescriptor CreateAccessTokenDescriptor(User user)
        {
            var claims = new List<Claim>
        {
            new(ClaimTypes.Sid, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Role, user.Role.ToString()),
        };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.Add(_jwtSettings.TokenLifeTime),
                SigningCredentials = new SigningCredentials(_symmetricSecurityKey, Hash),
            };

            return tokenDescriptor;
        }
    }
}
