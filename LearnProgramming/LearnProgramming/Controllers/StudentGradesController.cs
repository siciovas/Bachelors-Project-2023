using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Dto.DtoUpdate;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/grades")]
    public class StudentGradesController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IStudentGradesRep _gradesRep;

        public StudentGradesController(IMapper mapper, IStudentGradesRep gradesRep)
        {
            _mapper = mapper;
            _gradesRep = gradesRep;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<StudentGrades>> Post(StudentGradesPostDto grades)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));
            var grade = await _gradesRep.Get(grades.ProgrammingTaskId);

            if (grade == null)
            {
                var newGrade = new StudentGrades
                {
                    ProgrammingTaskId = grades.ProgrammingTaskId,
                    Grade = grades.Grade,
                    UserId = userId,
                };

                await _gradesRep.Create(newGrade);

                return Created($"api/{newGrade.Id}", _mapper.Map<StudentGradesPostDto>(newGrade));
            }

            await _gradesRep.Update(new StudentGradesUpdateDto
            {
                Grade = grades.Grade,
            }, grades.ProgrammingTaskId);

            return Ok(grades);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<StudentGradesDto>> GetStudentGrades()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var grades = await _gradesRep.GetAllByStudent(userId);

            var gradesDto = grades.Select(grade => _mapper.Map<StudentGradesDto>(grade))
                .ToList();

            return Ok(gradesDto);
        }

        [HttpGet]
        [Authorize]
        [Route("gradesForTeacher")]
        public async Task<ActionResult<StudentGradesForTeacherDto>> GetGradesForTeacher()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var grades = await _gradesRep.GetAllByTeacher(userId);

            return Ok(grades);
        }
    }
}
