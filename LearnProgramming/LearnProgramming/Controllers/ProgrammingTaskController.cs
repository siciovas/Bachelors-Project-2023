using AutoMapper;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
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
        public async Task<ActionResult<LearningTopicsDto>> Get(int learningtopicId, int subtopicId, int id)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var task = await _programmingTask.Get(id);

            var taskDto = _mapper.Map<ProgrammingTaskDto>(task);

            return Ok(taskDto);
        }

        [HttpDelete("{id}")]
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
        public async Task<ActionResult<ProgrammingTaskPostDto>> Update(int learningtopicId, int subtopicId, ProgrammingTaskPostDto programmingTask, int id)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var task = await _programmingTask.Get(id);
            if (task == null) return NotFound();

            task.Name = programmingTask.Name;
            task.Description = programmingTask.Description;
            task.DataAndAnswers = programmingTask.DataAndAnswers;
            task.AdditionalInformation = programmingTask.AdditionalInformation;

            await _programmingTask.Update(task);

            return Ok(programmingTask);
        }

        [HttpPost]
        public async Task<ActionResult<ProgrammingTaskPostDto>> Post(int learningtopicId, int subtopicId, ProgrammingTaskPostDto programmingTask)
        {
            var topic = await _learningTopicsRep.Get(learningtopicId);
            if (topic == null) return NotFound();

            var subTopic = await _subTopicsRep.Get(subtopicId);
            if (subTopic == null) return NotFound();

            var newTask = new ProgrammingTask
            {
                Name = programmingTask.Name,
                Description = programmingTask.Description,
                DataAndAnswers = programmingTask.DataAndAnswers,
                AdditionalInformation = programmingTask.AdditionalInformation,
                LearningTopicId = learningtopicId,
                SubTopicId = subtopicId,
            };

            await _programmingTask.Create(newTask);

            return Created($"api/learningtopic/{learningtopicId}/subtopic/{subtopicId}/task/{newTask.Id}", _mapper.Map<ProgrammingTaskPostDto>(newTask));
        }
    }
}
