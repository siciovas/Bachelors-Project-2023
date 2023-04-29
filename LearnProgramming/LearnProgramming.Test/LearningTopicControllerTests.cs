using AutoFixture;
using AutoMapper;
using LearnProgramming.API.Controllers;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace LearnProgramming.Test
{
    public class LearningTopicControllerTests
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILearningTopicsRep> _learningTopicsRep;
        private readonly Fixture _fixture;

        public LearningTopicControllerTests()
        {
            _mapper = new Mock<IMapper>();
            _learningTopicsRep = new Mock<ILearningTopicsRep>();
            _fixture = new Fixture();
        }

        public LearningTopicsController CreateController()
        {
            return new LearningTopicsController(
                _mapper.Object,
                _learningTopicsRep.Object
                );
        }

        [Fact]
        public async Task Test_Create()
        {
            var postDto = _fixture.Create<LearningTopicsPostDto>();
            var userId = Guid.NewGuid();
            _mapper.Setup(x => x.Map<LearningTopicsPostDto>(It.IsAny<LearningTopic>()))
                .Returns(new LearningTopicsPostDto
                {
                    Title = postDto.Title,
                    DifficultyInText = postDto.DifficultyInText
                });

            var user = new ClaimsPrincipal(new ClaimsIdentity(
                new Claim[]
                {
                    new Claim(ClaimTypes.Sid, userId.ToString())
                }
                ));

            var controller = CreateController();
            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = user };

            var response = await controller.Post(postDto);

            var requestResult = (CreatedResult)response.Result!;

            var objectResult = (LearningTopicsPostDto)requestResult.Value!;

            Assert.Equal(objectResult.Title, postDto.Title);
            Assert.Equal(objectResult.DifficultyInText, postDto.DifficultyInText);

            _learningTopicsRep.Verify(x => x.Create(It.Is<LearningTopic>(topic => topic.UserId == userId
            && topic.Title == postDto.Title
            && topic.DifficultyInText == postDto.DifficultyInText)),
            Times.Once);
        }

        [Fact]
        public async Task Test_GetAllByTeacher()
        {
            var userId = Guid.NewGuid();

            var learningTopicsDto = _fixture.CreateMany<LearningTopicsDto>(2).ToList();
            _learningTopicsRep.Setup(x => x.GetAllByTeacher(It.IsAny<Guid>()))
                .ReturnsAsync(learningTopicsDto);


            var user = new ClaimsPrincipal(new ClaimsIdentity(
                new Claim[]
                {
                    new Claim(ClaimTypes.Sid, userId.ToString()),
                    new Claim(ClaimTypes.Role, "Teacher")
                }
                ));

            var controller = CreateController();
            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = user };

            var response = await controller.GetAll();

            var requestResult = (OkObjectResult)response.Result!;

            var objectResult = (List<LearningTopicsDto>)requestResult!.Value!;

            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
            _learningTopicsRep.Verify(x => x.GetAllByTeacher(It.Is<Guid>(guid => guid == userId)), Times.Once);
            Assert.Equal(2, objectResult.Count);
        }

        [Fact]
        public async Task Test_GetAllByStudent()
        {
            var userId = Guid.NewGuid();

            var learningTopicsDto = _fixture.CreateMany<LearningTopicsDto>(2).ToList();
            _learningTopicsRep.Setup(x => x.GetAllByStudent(It.IsAny<Guid>()))
                .ReturnsAsync(learningTopicsDto);


            var user = new ClaimsPrincipal(new ClaimsIdentity(
                new Claim[]
                {
                    new Claim(ClaimTypes.Sid, userId.ToString()),
                    new Claim(ClaimTypes.Role, "Student")
                }
                ));

            var controller = CreateController();
            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext { User = user };

            var response = await controller.GetAll();

            var requestResult = (OkObjectResult)response.Result!;

            var objectResult = (List<LearningTopicsDto>)requestResult!.Value!;

            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
            _learningTopicsRep.Verify(x => x.GetAllByStudent(It.Is<Guid>(guid => guid == userId)), Times.Once);
            Assert.Equal(2, objectResult.Count);
        }
    }
}
