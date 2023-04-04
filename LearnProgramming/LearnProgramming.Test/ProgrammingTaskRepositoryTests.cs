using AutoFixture;
using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace LearnProgramming.Test
{
    public class ProgrammingTaskRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public ProgrammingTaskRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private ProgrammingTaskRepository CreateRepository()
        {
            return new ProgrammingTaskRepository(_databaseContext);
        }

        [Fact]
        public async void Create_ProgrammingTask_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture.Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture.Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture.Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Without(x => x.ProgrammingTaskTests)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(programmingTask);

            var expected = await _databaseContext.ProgrammingTasks.FirstAsync();

            Assert.Equal(expected.Name, programmingTask.Name);
            Assert.Equal(expected.Description, programmingTask.Description);
            Assert.Equal(expected.ProgrammingTaskTests, programmingTask.ProgrammingTaskTests);
            Assert.Equal(expected.LearningTopicId, programmingTask.LearningTopicId);
            Assert.Equal(expected.SubTopicId, programmingTask.SubTopicId);
        }

        [Fact]
        public async void Delete_ProgrammingTask_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture.Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture.Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture.Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Without(x => x.ProgrammingTaskTests)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            await repo.Delete(programmingTask);

            var expected = await _databaseContext.ProgrammingTasks.FirstOrDefaultAsync();

            Assert.Null(expected);
        }

        [Fact]
        public async void GetAll_ProgrammingTaskBySubTopicId_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture.Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture.Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture.Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Without(x => x.ProgrammingTaskTests)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll(programmingTask.SubTopicId);

            Assert.Single(result);
            Assert.Equal(programmingTask.Name, result[0].Name);
            Assert.Equal(programmingTask.Description, result[0].Description);
            Assert.Equal(programmingTask.ProgrammingTaskTests, result[0].ProgrammingTaskTests);
            Assert.Equal(programmingTask.LearningTopicId, result[0].LearningTopicId);
            Assert.Equal(programmingTask.SubTopicId, result[0].SubTopicId);
        }

        [Fact]
        public async void Get_ProgrammingTaskById_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture.Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture.Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture.Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Without(x => x.ProgrammingTaskTests)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Get(programmingTask.Id);

            Assert.NotNull(result);
            Assert.Equal(programmingTask.Name, result!.Name);
            Assert.Equal(programmingTask.Description, result.Description);
            Assert.Equal(programmingTask.ProgrammingTaskTests, result.ProgrammingTaskTests);
            Assert.Equal(programmingTask.LearningTopicId, result.LearningTopicId);
            Assert.Equal(programmingTask.SubTopicId, result.SubTopicId);
        }

        [Fact]
        public async void Update_ProgramminTask_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture.Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture.Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture.Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Without(x => x.ProgrammingTaskTests)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var newTaskName = _fixture.Create<string>();

            var programminTaskDto = new ProgrammingTaskDto
            {
                Name = newTaskName
            };

            await repo.Update(programminTaskDto, programmingTask.Id);

            var expected = await _databaseContext.ProgrammingTasks.FirstAsync();

            Assert.Equal(expected.Name, newTaskName);
        }
        [Fact]
        public async void AddTests_ProgramminTaskTests_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture.Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture.Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture.Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Without(x => x.ProgrammingTaskTests)
                .Create();

            var programmingtTaskTests = _fixture.Build<ProgrammingTaskTest>()
                .With(x => x.ProgrammingTaskId, programmingTask.Id)
                .Without(x => x.ProgrammingTask)
                .CreateMany(1)
                .ToList();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            await repo.AddTests(programmingtTaskTests);

            var expected = await _databaseContext.ProgrammingTaskTests.FirstAsync();

            Assert.Equal(expected.Input, programmingtTaskTests.First().Input);
            Assert.Equal(expected.Output, programmingtTaskTests.First().Output);
        }
    }
}
