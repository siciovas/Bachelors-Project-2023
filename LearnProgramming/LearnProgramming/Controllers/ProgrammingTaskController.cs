using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnProgramming.API.Controllers
{
    [ApiController]
    [Route("api/learningtopic/{learningtopicId}/subtopic/{subtopicId}/task")]
    public class ProgrammingTaskController : Controller
    {
        private readonly IProgrammingTaskRep _programmingTask;
        private readonly IMapper _mapper;
        private readonly ISubTopicsRep _subTopicsRep;
        private readonly ILearningTopicsRep _learningTopicsRep;

        public ProgrammingTaskController(IProgrammingTaskRep programmingTask, IMapper mapper, ILearningTopicsRep learningTopicsRep, ISubTopicsRep subTopicsRep)
        {
            _programmingTask = programmingTask;
            _mapper = mapper;
            _learningTopicsRep = learningTopicsRep;
            _subTopicsRep = subTopicsRep;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<ProgrammingTaskDto>>> GetAll(int learningtopicId, int subtopicId)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var tasks = await _programmingTask.GetAll(subtopicId);

            var tasksDto = tasks.Select(x => _mapper.Map<ProgrammingTaskDto>(x)).ToList();

            return Ok(tasksDto);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ProgrammingTaskDto>> Get(int learningtopicId, int subtopicId, int id)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var task = await _programmingTask.Get(id);

            var taskDto = new ProgrammingTaskDto
            {
                Id = task.Id,
                Name = task.Name,
                Description = task.Description,
                ProgrammingCode = task.ProgrammingCode,
                LearningTopicName = task.LearningTopic.Title,
                SubTopicName = task.SubTopic.SubTopicName,
                Tests = await _programmingTask.GetTaskTests(id),
            };

            return Ok(taskDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<ActionResult> Delete(int learningtopicId, int subtopicId, int id)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var task = await _programmingTask.Get(id);
            if (task == null) return NotFound();

            await _programmingTask.Delete(task);

            return NoContent();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<ProgrammingTaskPostDto>> Update(int learningtopicId, int subtopicId, ProgrammingTaskDto programmingTask, int id)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var task = await _programmingTask.Get(id);
            if (task == null) return NotFound();

            await _programmingTask.Update(programmingTask, id);

            return Ok(programmingTask);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<int>> Post(int learningtopicId, int subtopicId, ProgrammingTaskPostDto programmingTask)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var newTask = new ProgrammingTask
            {
                Name = programmingTask.Name,
                Description = programmingTask.Description,
                ProgrammingCode = programmingTask.ProgrammingCode,
                LearningTopicId = learningtopicId,
                SubTopicId = subtopicId,
            };

            await _programmingTask.Create(newTask);

            var newTests = programmingTask.InputOutput.Select(x => new ProgrammingTaskTest
            {
                Input = x.Input,
                Output = x.Output,
                ProgrammingTaskId = newTask.Id
            }).ToList();

            await _programmingTask.AddTests(newTests);

            newTask.ProgrammingTaskTests = newTests;

            return Created($"api/learningtopic/{learningtopicId}/subtopic/{subtopicId}/task/{newTask.Id}", newTask.Id);
        }

    }
}
