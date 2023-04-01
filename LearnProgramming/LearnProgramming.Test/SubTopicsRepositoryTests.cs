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
    public class SubTopicsRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public SubTopicsRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private SubTopicsRepository CreateRepository()
        {
            return new SubTopicsRepository(_databaseContext);
        }

        [Fact]
        public async void Get_GetExistingSubTopic_ReturnCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                    .Build<LearningTopic>()
                    .With(x => x.UserId, user.Id)
                    .Without(x => x.User)
                    .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Get(subTopic.Id);

            var expected = await _databaseContext.SubTopics.FirstAsync();

            Assert.Equal(expected.SubTopicName, result.SubTopicName);
        }

        [Fact]
        public async void Create_CreateSubTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Create(subTopic);

            var expected = await _databaseContext.SubTopics.FirstAsync();

            Assert.Equal(expected.SubTopicName, result.SubTopicName);

        }

        [Fact]
        public async void Update_UpdateSubTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic);
            await _databaseContext.SaveChangesAsync();

            var newNameForSubTopic = _fixture.Create<string>();

            var subTopicUpdateDto = new SubTopicUpdateDto
            {
                SubTopicName = newNameForSubTopic
            };

            await repo.Update(subTopicUpdateDto, subTopic.Id);

            var expected = await _databaseContext.SubTopics.FirstAsync();

            Assert.Equal(expected.SubTopicName, newNameForSubTopic);
        }

        [Fact]
        public async void Delete_DeleteSubTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic, subTopic);
            await _databaseContext.SaveChangesAsync();

            await repo.Delete(subTopic);

            var expected = await _databaseContext.SubTopics.FirstOrDefaultAsync();

            Assert.Null(expected);
        }

        [Fact]
        public async void GetAll_GetAllSubTopicsWithoutProgrammingTask_ReturnCorrectData()
        {
            var repo = CreateRepository();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            await _databaseContext.AddRangeAsync(learningTopic, subTopic);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll(learningTopic.Id);

            Assert.Single(result);
            Assert.Equal(0, result[0].NumberOfTasks);
            Assert.Equal(subTopic.SubTopicName, result[0].SubTopicName);
            Assert.Equal(subTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAll_GetAllSubTopicsWithProgrammingTask_ReturnCorrectData()
        {
            var repo = CreateRepository();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture
                .Build<ProgrammingTask>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .With(x => x.SubTopicId, subTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Create();

            await _databaseContext.AddRangeAsync(learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll(learningTopic.Id);

            Assert.Single(result);
            Assert.Equal(1, result[0].NumberOfTasks);
            Assert.Equal(subTopic.SubTopicName, result[0].SubTopicName);
            Assert.Equal(subTopic.Id, result[0].Id);
        }

    }
}
