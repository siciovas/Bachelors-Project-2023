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
    public class ProductControllerTests
    {
        private readonly Mock<IProductRep> _productRep;
        private readonly Mock<IMapper> _mapper;
        private readonly Fixture _fixture;

        public ProductControllerTests()
        {
            _productRep = new Mock<IProductRep>();
            _mapper = new Mock<IMapper>();
            _fixture = new Fixture();
            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        public ProductController CreateController()
        {
            return new ProductController(
                _mapper.Object,
                _productRep.Object
                );
        }

        [Fact]
        public async void Test_GetAll()
        {
            var products = _fixture.Create<List<Product>>();
            _productRep.Setup(x => x.GetAll())
                .ReturnsAsync(products);

            var controller = CreateController();

            var result = await controller.GetAll();

            var requestResult = (OkObjectResult)result.Result!;

            _productRep.Verify(x => x.GetAll(),
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Get()
        {
            var product = _fixture.Create<Product>();
            _productRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(product);

            var controller = CreateController();
            var productId = _fixture.Create<int>();

            var result = await controller.Get(productId);

            var requestResult = (OkObjectResult)result.Result!;

            _productRep.Verify(x => x.Get(It.Is<int>(id => id == productId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Get_NotFound()
        {

            var controller = CreateController();
            var productId = _fixture.Create<int>();

            var result = await controller.Get(productId);

            var requestResult = (NotFoundResult)result.Result!;

            _productRep.Verify(x => x.Get(It.Is<int>(id => id == productId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status404NotFound, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Delete()
        {
            var product = _fixture.Create<Product>();
            _productRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(product);
            var controller = CreateController();
            var productId = _fixture.Create<int>();

            var result = await controller.Delete(productId);

            var requestResult = (NoContentResult)result.Result!;

            _productRep.Verify(x => x.Delete(It.Is<Product>(model => model.Id == product.Id)),
                Times.Once);
            Assert.Equal(StatusCodes.Status204NoContent, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Update()
        {
            var productDto = _fixture.Create<ProductDto>();
            var product = _fixture.Create<Product>();
            _productRep.Setup(x => x.Get(It.IsAny<int>()))
                .ReturnsAsync(product);
            var controller = CreateController();
            var productId = _fixture.Create<int>();

            var result = await controller.Update(productDto, productId);

            var requestResult = (OkObjectResult)result.Result!;

            _productRep.Verify(x => x.Update(It.Is<ProductDto>(model => model.Name == productDto.Name),
                It.Is<int>(id => id == productId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_Post()
        {
            var productDto = _fixture.Create<ProductDto>();
            var controller = CreateController();
            var productId = _fixture.Create<int>();

            var result = await controller.Post(productDto);

            var requestResult = (CreatedResult)result.Result!;

            _productRep.Verify(x => x.Create(It.Is<Product>(model => model.Name == productDto.Name &&
            model.Publisher == productDto.Publisher &&
            model.Price == productDto.Price &&
            model.ReleaseDate == productDto.ReleaseDate &&
            model.BookCoverType == productDto.BookCoverType &&
            model.Language == productDto.Language &&
            model.PageNumber == productDto.PageNumber &&
            model.Description == productDto.Description &&
            model.Photo == productDto.Photo)),
                Times.Once);
            Assert.Equal(StatusCodes.Status201Created, requestResult.StatusCode);
        }

        [Fact]
        public async void Test_GetSuggestions()
        {
            var products = _fixture.Create<List<Product>>();
            _productRep.Setup(x => x.GetSuggestions(It.IsAny<int>()))
                .ReturnsAsync(products);

            var controller = CreateController();
            var productId = _fixture.Create<int>();
            var result = await controller.GetSuggestions(productId);

            var requestResult = (OkObjectResult)result.Result!;

            _productRep.Verify(x => x.GetSuggestions(It.Is<int>(id => id == productId)),
                Times.Once);
            Assert.Equal(StatusCodes.Status200OK, requestResult.StatusCode);
        }
    }
}
