using AutoFixture;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoUpdate;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Xunit;

namespace LearnProgramming.Test
{
    public class StudentGradesRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public StudentGradesRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private StudentGradesRepository CreateRepository()
        {
            return new StudentGradesRepository(_databaseContext);
        }

        [Fact]
        public async void Create_CreatesStudentGrade_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var programmingTask = _fixture.Create<ProgrammingTask>();

            var grade = _fixture.Build<StudentGrades>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProgrammingTaskId, programmingTask.Id)
                .Without(x => x.User)
                .Without(x => x.ProgrammingTask)
                .Create();

            await _databaseContext.AddRangeAsync(user, programmingTask);
            await _databaseContext.SaveChangesAsync();

            await repo.Create(grade);

            var expected = await _databaseContext.StudentGrades.FirstAsync();

            Assert.Equal(expected.UserId, grade.UserId);
            Assert.Equal(expected.ProgrammingTaskId, grade.ProgrammingTaskId);
            Assert.Equal(expected.Grade, grade.Grade);
        }

        [Fact]
        public async void Update_UpdatesStudentGrade_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var programmingTask = _fixture.Create<ProgrammingTask>();

            var grade = _fixture.Build<StudentGrades>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProgrammingTaskId, programmingTask.Id)
                .Without(x => x.User)
                .Without(x => x.ProgrammingTask)
                .Create();

            await _databaseContext.AddRangeAsync(user, programmingTask, grade);
            await _databaseContext.SaveChangesAsync();

            var newGrade = _fixture.Create<double>();

            var gradeDto = new StudentGradesUpdateDto
            {
                Grade = newGrade
            };

            await repo.Update(gradeDto, grade.ProgrammingTaskId);

            var expected = await _databaseContext.StudentGrades.FirstAsync();

            Assert.Equal(expected.Grade, newGrade);
        }

        [Fact]
        public async void Get_GetStudentGrade_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var programmingTask = _fixture.Create<ProgrammingTask>();

            var grade = _fixture.Build<StudentGrades>()
                .With(x => x.UserId, user.Id)
                .With(x => x.ProgrammingTaskId, programmingTask.Id)
                .Without(x => x.User)
                .Without(x => x.ProgrammingTask)
                .Create();

            await _databaseContext.AddRangeAsync(user,programmingTask,grade);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Get(grade.ProgrammingTaskId);

            Assert.Equal(grade.Id, result!.Id);
            Assert.Equal(grade.ProgrammingTaskId, result.ProgrammingTaskId);
            Assert.Equal(grade.Grade, result.Grade);
        }

    }
}
