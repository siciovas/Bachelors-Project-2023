using AutoFixture;
using AutoMapper;
using LearnProgramming.API.Controllers;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace LearnProgramming.Test
{
    public class SubTopicsControllerTests
    {
        private readonly Mock<ISubTopicsRep> _subTopicsRep;
        private readonly Mock<ILearningTopicsRep> _learningTopicsRep;
        private readonly Mock<IMapper> _mapper;
        private readonly Fixture _fixture;

        public SubTopicsControllerTests()
        {
            _subTopicsRep = new Mock<ISubTopicsRep>();
            _learningTopicsRep = new Mock<ILearningTopicsRep>();
            _mapper = new Mock<IMapper>();
            _fixture = new Fixture();
            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        public SubTopicsController CreateController()
        {
            return new SubTopicsController(
                _subTopicsRep.Object,
                _learningTopicsRep.Object,
                _mapper.Object
                );
        }

        [Fact]
        public async void Test_GetAll()
        {
            var subTopics = _fixture.Create<List<SubTopicDto>>();
            _subTopicsRep.Setup(x => x.GetAll(It.IsAny<int>()))
                .ReturnsAsync(subTopics);

            var controller = CreateController();
            var learningTopicId = _fixture.Create<int>();

            var result = await controller.GetAll(learningTopicId);

            var requestResult = (OkObjectResult)result.Result!;

            _subTopicsRep.Verify(x => x.GetAll(It.Is<int>(id => id == learningTopicId)), 
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Get()
        {
            var subTopic = _fixture.Create<SubTopic>();
            var learningTopic = _fixture.Create<LearningTopic>();
            _subTopicsRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(subTopic);
            _learningTopicsRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(learningTopic);

            var controller = CreateController();
            var learningTopicId = _fixture.Create<int>();
            var subTopicId = _fixture.Create<int>();

            var result = await controller.Get(subTopicId, learningTopicId);

            var requestResult = (OkObjectResult)result.Result!;

            var objectResult = (SubTopicDto)requestResult!.Value!;

            _subTopicsRep.Verify(x => x.Get(It.Is<int>(id => id == subTopicId)),
                Times.Once);
            _learningTopicsRep.Verify(x => x.Get(It.Is<int>(id => id == learningTopicId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
            Assert.Equal(subTopic.SubTopicName, objectResult.SubTopicName);
            Assert.Equal(subTopic.Id, objectResult.Id);
        }

        [Fact]
        public async void Test_Post()
        {
            var subTopic = _fixture.Create<SubTopicPostDto>();
            var learningTopic = _fixture.Create<LearningTopic>();
            _learningTopicsRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(learningTopic);

            var controller = CreateController();
            var learningTopicId = _fixture.Create<int>();

            var result = await controller.Post(learningTopicId, subTopic);

            var requestResult = (CreatedResult)result.Result!;

            var objectResult = (SubTopicDto)requestResult!.Value!;

            _subTopicsRep.Verify(x => x.Create(It.Is<SubTopic>(model => model.SubTopicName == subTopic.SubTopicName &&
            model.LearningTopicId == learningTopicId)),
                Times.Once);
            _learningTopicsRep.Verify(x => x.Get(It.Is<int>(id => id == learningTopicId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status201Created, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Update()
        {
            var subTopic = _fixture.Create<SubTopicUpdateDto>();
            var learningTopic = _fixture.Create<LearningTopic>();
            _learningTopicsRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(learningTopic);

            var controller = CreateController();
            var learningTopicId = _fixture.Create<int>();
            var subTopicId = _fixture.Create<int>();

            var result = await controller.Update(learningTopicId, subTopicId, subTopic);

            var requestResult = (OkObjectResult)result.Result!;

            var objectResult = (SubTopicUpdateDto)requestResult!.Value!;

            _subTopicsRep.Verify(x => x.Update(It.Is<SubTopicUpdateDto>(model => model.SubTopicName == subTopic.SubTopicName),
                It.Is<int>(id => id == subTopicId)),
                Times.Once);
            _learningTopicsRep.Verify(x => x.Get(It.Is<int>(id => id == learningTopicId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Delete()
        {
            var subTopic = _fixture.Create<SubTopic>();
            var learningTopic = _fixture.Create<LearningTopic>();
            _subTopicsRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(subTopic);
            _learningTopicsRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(learningTopic);

            var controller = CreateController();
            var learningTopicId = _fixture.Create<int>();
            var subTopicId = _fixture.Create<int>();

            var result = await controller.Delete(learningTopicId, subTopicId);

            var requestResult = (NoContentResult)result;

            _subTopicsRep.Verify(x => x.Get(It.Is<int>(id => id == subTopicId)),
                Times.Once);
            _learningTopicsRep.Verify(x => x.Get(It.Is<int>(id => id == learningTopicId)),
                Times.Once);
            _subTopicsRep.Verify(x => x.Delete(It.Is<SubTopic>(model => model.Id == subTopic.Id)),
                Times.Once);
            Assert.Equal(StatusCodes.Status204NoContent, requestResult.StatusCode);
        }
    }
}
