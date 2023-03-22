using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/submission")]
    public class SubmissionController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ISubmissionRep _submissionRep;

        public SubmissionController(IMapper mapper, ISubmissionRep submissionRep)
        {
            _mapper = mapper;
            _submissionRep = submissionRep;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Student,Teacher")]
        public async Task<ActionResult<List<SubmissionUserDto>>> GetAll()
        {
            if (User.IsInRole("Admin"))
            {
                var submissions = await _submissionRep.GetAll();

                return Ok(submissions.Select(submission => new SubmissionUserDto
                {
                    Topic = submission.Topic,
                    Message = submission.Message,
                    Name = submission.User.Name,
                    Surname = submission.User.Surname,
                }).ToList());
            }
            else
            {
                var submissions = await _submissionRep.GetById(Guid.Parse(User.FindFirstValue(ClaimTypes.Sid)));

                return Ok(submissions.Select(submission => new SubmissionUserDto
                {
                    Topic = submission.Topic,
                    Message = submission.Message,
                    Name = submission.User.Name,
                    Surname = submission.User.Surname,
                }).ToList());
            }

        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SubmissionDto>> Post(SubmissionDto submissionUserDto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var newSubmission = new Submission
            {
                Topic = submissionUserDto.Topic,
                Message = submissionUserDto.Message,
                UserId = userId,
            };

            await _submissionRep.Create(newSubmission);

            return Created($"api/{newSubmission.Id}", _mapper.Map<SubmissionDto>(newSubmission));
          
        }
    }
}
