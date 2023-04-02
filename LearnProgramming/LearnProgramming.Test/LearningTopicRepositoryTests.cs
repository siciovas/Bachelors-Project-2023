using Xunit;
using AutoFixture;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using System;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Repositories;
using System.Linq;
using LearnProgramming.Core.Dto;

namespace LearnProgramming.Test
{
    public class LearningTopicRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public LearningTopicRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private LearningTopicsRepository CreateRepository()
        {
            return new LearningTopicsRepository(_databaseContext);
        }

        [Fact]
        public async void GetAll_ExistingTopicWithoutSubtopicsAndTasks_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .Create();

            await _databaseContext.AddAsync(learningTopic);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            Assert.Single(result);
            Assert.Equal(0, result[0].NumberOfSubTopics);
            Assert.Equal(0, result[0].NumberOfAllTasks);
            Assert.Equal(learningTopic.Title, result[0].Title);
            Assert.Equal(learningTopic.DifficultyInText, result[0].DifficultyInText);
            Assert.Equal(learningTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAll_ExistingTopicWithSubtopicsAndTasks_ReturnsCorrectData()
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
                .With(x => x.SubTopicId, subTopic.Id)
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Create();      

            await _databaseContext.AddRangeAsync(learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            Assert.Single(result);
            Assert.Equal(1, result[0].NumberOfSubTopics);
            Assert.Equal(1, result[0].NumberOfAllTasks);
            Assert.Equal(learningTopic.Title, result[0].Title);
            Assert.Equal(learningTopic.DifficultyInText, result[0].DifficultyInText);
            Assert.Equal(learningTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAllByTeacher_ExistingTeacherTopicWithoutSubtopicsAndTasks_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Create();

            await _databaseContext.AddRangeAsync(learningTopic, user);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAllByTeacher(learningTopic.UserId);

            Assert.Single(result);
            Assert.Equal(0, result[0].NumberOfSubTopics);
            Assert.Equal(0, result[0].NumberOfAllTasks);
            Assert.Equal(learningTopic.Title, result[0].Title);
            Assert.Equal(learningTopic.DifficultyInText, result[0].DifficultyInText);
            Assert.Equal(learningTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAllByTeacher_ExistingTeacherTopicWithSubtopicsAndTasks_ReturnsCorrectData()
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

            var programmingTask = _fixture
                .Build<ProgrammingTask>()
                .With(x => x.SubTopicId, subTopic.Id)
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Create();

            await _databaseContext.AddRangeAsync(learningTopic, user, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAllByTeacher(learningTopic.UserId);

            Assert.Single(result);
            Assert.Equal(1, result[0].NumberOfSubTopics);
            Assert.Equal(1, result[0].NumberOfAllTasks);
            Assert.Equal(learningTopic.Title, result[0].Title);
            Assert.Equal(learningTopic.DifficultyInText, result[0].DifficultyInText);
            Assert.Equal(learningTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAllByStudent_ExistingTeacherTopicWithoutSubtopicsAndTasks_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var teacher = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.Id, _fixture.Create<int>())
                .With(x => x.UserId, relationship.TeacherId)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(teacher, student, relationship, learningTopic);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAllByStudent(student.Id);

            Assert.Single(result);
            Assert.Equal(0, result[0].NumberOfSubTopics);
            Assert.Equal(0, result[0].NumberOfAllTasks);
            Assert.Equal(learningTopic.Title, result[0].Title);
            Assert.Equal(learningTopic.DifficultyInText, result[0].DifficultyInText);
            Assert.Equal(learningTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAllByStudent_ExistingTeacherTopicWithSubtopicsAndTasks_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var teacher = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.Id, _fixture.Create<int>())
                .With(x => x.UserId, relationship.TeacherId)
                .Without(x => x.User)
                .Create();

            var subTopic = _fixture
                .Build<SubTopic>()
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Create();

            var programmingTask = _fixture
                .Build<ProgrammingTask>()
                .With(x => x.SubTopicId, subTopic.Id)
                .With(x => x.LearningTopicId, learningTopic.Id)
                .Without(x => x.LearningTopic)
                .Without(x => x.SubTopic)
                .Create();

            await _databaseContext.AddRangeAsync(teacher, student, relationship, learningTopic, subTopic, programmingTask);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAllByStudent(student.Id);

            Assert.Single(result);
            Assert.Equal(1, result[0].NumberOfSubTopics);
            Assert.Equal(1, result[0].NumberOfAllTasks);
            Assert.Equal(learningTopic.Title, result[0].Title);
            Assert.Equal(learningTopic.DifficultyInText, result[0].DifficultyInText);
            Assert.Equal(learningTopic.Id, result[0].Id);
        }

        [Fact]
        public async void GetAllByStudent_NoTeacherExisting_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var result = await repo.GetAllByStudent(_fixture.Create<Guid>());

            Assert.Empty(result);
        }

        [Fact]
        public async void Create_CreateLearningTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(learningTopic);

            var expected = await _databaseContext.LearningTopics.FirstAsync();

            Assert.Equal(expected.Title, learningTopic.Title);
            Assert.Equal(expected.DifficultyInText, learningTopic.DifficultyInText);
        }

        [Fact]
        public async void Update_UpdateLearningTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic);
            await _databaseContext.SaveChangesAsync();

            var newTitleForLearningTopic = _fixture.Create<string>();

            var learningTopicDto = new LearningTopicsDto
            {
                Title = newTitleForLearningTopic
            };

            learningTopic.Title = newTitleForLearningTopic;

            await repo.Update(learningTopicDto, learningTopic.Id);

            var expected = await _databaseContext.LearningTopics.FirstAsync();

            Assert.Equal(expected.Title, newTitleForLearningTopic);
        }

        [Fact]
        public async void Delete_DeleteLearningTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic);
            await _databaseContext.SaveChangesAsync();

            await repo.Delete(learningTopic);

            var expected = await _databaseContext.LearningTopics.FirstOrDefaultAsync();

            Assert.Null(expected);
        }

        [Fact]
        public async void Get_GetsExistingLearningTopic_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var learningTopic = _fixture
                .Build<LearningTopic>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(user, learningTopic);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Get(learningTopic.Id);

            var expected = await _databaseContext.LearningTopics.FirstAsync();

            Assert.Equal(expected.Title, result.Title);
            Assert.Equal(expected.DifficultyInText, result.DifficultyInText);
        }
    }
}