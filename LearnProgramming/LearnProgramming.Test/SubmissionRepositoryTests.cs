using AutoFixture;
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
    public class SubmissionRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public SubmissionRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private SubmissionRepository CreateRepository()
        {
            return new SubmissionRepository(_databaseContext);
        }

        [Fact]
        public async void Create_CreateSubmission_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var submission = _fixture
                .Build<Submission>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Create(submission);

            var expected = await _databaseContext.Submission.FirstAsync();

            Assert.Equal(expected.Topic, result.Topic);
            Assert.Equal(expected.Message, result.Message);

        }

        [Fact]
        public async void GetAll_AllExistingSubmissions_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var submission = _fixture
                .Build<Submission>()
                .Create();

            await _databaseContext.AddAsync(submission);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            Assert.Single(result);
            Assert.Equal(submission.Topic, result[0].Topic);
            Assert.Equal(submission.Message, result[0].Message);
        }

        [Fact]
        public async void GetById_GetUserSubmissions_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var submission = _fixture
                .Build<Submission>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(user, submission);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetById(submission.UserId);

            Assert.Single(result);
            Assert.Equal(submission.Topic, result[0].Topic);
            Assert.Equal(submission.Message, result[0].Message);
        }
    }
}
