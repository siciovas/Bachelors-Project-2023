using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/learningtopic")]
    public class LearningTopicsController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ILearningTopicsRep _learningTopicsRep;
        
        public LearningTopicsController(IMapper mapper, ILearningTopicsRep learningTopicsRep)
        {
            _mapper = mapper;
            _learningTopicsRep = learningTopicsRep;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<LearningTopicsDto>>> GetAll()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));
            List<LearningTopicsDto>? learningTopics;

            if (User.IsInRole("Admin"))
            {
                learningTopics = await _learningTopicsRep.GetAll();
            }

            else if (User.IsInRole("Teacher"))
            {
                learningTopics = await _learningTopicsRep.GetAllByTeacher(userId);
            }

            else
            {
                learningTopics = await _learningTopicsRep.GetAllByStudent(userId);
            }


            return Ok(learningTopics);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<LearningTopicsDto>> Get(int id)
        {
            var topics = await _learningTopicsRep.Get(id);
            if (topics == null) return NotFound();

            var topicsDto = _mapper.Map<LearningTopicsDto>(topics);

            return Ok(topicsDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<ActionResult> Delete(int id)
        {
            var topics = await _learningTopicsRep.Get(id);
            if (topics == null) return NotFound();

            await _learningTopicsRep.Delete(topics);

            return NoContent();
        }

        [HttpPut]
        [Authorize(Roles = "Teacher")]

        public async Task<ActionResult<LearningTopicsDto>> Update(LearningTopicsDto learningTopics, int id) 
        {

            await _learningTopicsRep.Update(learningTopics, id);

            return Ok(learningTopics);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<LearningTopicsPostDto>> Post(LearningTopicsPostDto learningTopics)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.Sid));

            var newTopic = new LearningTopic
            {

                Title = learningTopics.Title,
                DifficultyInText = learningTopics.DifficultyInText,
                UserId = userId
            };

            await _learningTopicsRep.Create(newTopic);

            return Created($"api/learningtopic{newTopic.Id}", _mapper.Map<LearningTopicsPostDto>(newTopic));
        }
    }
}
