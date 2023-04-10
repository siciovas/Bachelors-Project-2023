using AutoFixture;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using Xunit;

namespace LearnProgramming.Test
{
    public class ShippingInformationRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public ShippingInformationRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        }

        private ShippingInformationRepository CreateRepository()
        {
            return new ShippingInformationRepository(_databaseContext);
        }

        [Fact]
        public async void Create_ShippingInformation_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var shippingInformation = _fixture.Build<ShippingInformation>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Create(shippingInformation);

            var expected = await _databaseContext.ShippingInformation.FirstAsync();

            Assert.Equal(expected.Address, result.Address);
            Assert.Equal(expected.Name, result.Name);
            Assert.Equal(expected.Region, result.Region);
            Assert.Equal(expected.Email, result.Email);
            Assert.Equal(expected.City, result.City);
            Assert.Equal(expected.Street, result.Street);
            Assert.Equal(expected.UserId, result.UserId);
        }

        [Fact]
        public async void Get_ShippingInformation_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var shippingInformation = _fixture.Build<ShippingInformation>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(user, shippingInformation);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Get(shippingInformation.UserId);

            Assert.Equal(shippingInformation.Address, result!.Address);
            Assert.Equal(shippingInformation.Name, result.Name);
            Assert.Equal(shippingInformation.Region, result.Region);
            Assert.Equal(shippingInformation.Email, result.Email);
            Assert.Equal(shippingInformation.City, result.City);
            Assert.Equal(shippingInformation.Street, result.Street);
            Assert.Equal(shippingInformation.UserId, result.UserId);
        }

        [Fact]
        public async void Update_ShippingInformation_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            var shippingInformation = _fixture.Build<ShippingInformation>()
                .With(x => x.UserId, user.Id)
                .Without(x => x.User)
                .Create();

            await _databaseContext.AddRangeAsync(user, shippingInformation);
            await _databaseContext.SaveChangesAsync();

            var newAddress = _fixture.Create<string>();

            var shippingInformationDto = new ShippingInformationPostDto
            {
                Address = newAddress
            };

            await repo.Update(shippingInformationDto, shippingInformation.UserId);

            var expected = await _databaseContext.ShippingInformation.FirstAsync();

            Assert.Equal(expected.Address, newAddress);
        }

    }
}
