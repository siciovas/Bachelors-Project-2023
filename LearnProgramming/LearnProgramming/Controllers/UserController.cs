using AutoMapper;
using LearnProgramming.Core.Commands;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : Controller
    {
        private readonly IUserRep _userRepository;
        private readonly IJwtServ _jwt;
        private readonly IMapper _mapper;
        private readonly IHashServ _hashService;

        public UserController(IUserRep userRepository, IJwtServ jwt, IMapper mapper, IHashServ hashService)
        {
            _userRepository = userRepository;
            _jwt = jwt;
            _mapper = mapper;
            _hashService = hashService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> Register(Register register)
        {
            var user = await _userRepository.GetByUsername(register.UserName);

            if (user != null)
            {
                return Conflict(new ErrorDto("Vartotojo vardas užimtas"));
            }

            user = await _userRepository.GetByEmail(register.Email);

            if (user != null)
            {
                return Conflict(new ErrorDto("Vartotojo el. paštas užimtas"));
            }

            var (passwordHash, passwordSalt) = _hashService.HashPassword(register.Password);

            var newUser = new User()
            {
                Id = Guid.NewGuid(),
                UserName = register.UserName,
                Name = register.Name,
                Surname = register.Surname,
                Email = register.Email,
                Sex = register.Sex,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                City = register.City,
                School = register.School,
                Role = Domain.Enums.AllRoles.Student
            };

            await _userRepository.Register(newUser);

            var userDto = _mapper.Map<UserDto>(newUser);

            return CreatedAtAction(nameof(Register), userDto);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<AuthDto>> Login(Login login)
        {
            var user = await _userRepository.GetByUsername(login.UsernameOrEmail);

            if (user == null)
            {
                user = await _userRepository.GetByEmail(login.UsernameOrEmail);

                if (user == null)
                {
                    return NotFound("Tokia paskyra neegzistuoja");
                }
            }

            using var hmac = new HMACSHA256(user.PasswordSalt);
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));

            if (!hash.SequenceEqual(user.PasswordHash))
            {
                return BadRequest("Neteisingi duomenys");
            }

            var jwt = _jwt.BuildJwt(user);

            return Ok(new AuthDto(jwt, user.Role));
        }

        [Authorize]
        [HttpGet]
        [Route("me")]
        public async Task<ActionResult<int>> Me()
        {
            var user = await _userRepository.GetById(Guid.Parse(User.FindFirstValue(ClaimTypes.Sid)));

            return Ok(user.Role);
        }
    }
}
