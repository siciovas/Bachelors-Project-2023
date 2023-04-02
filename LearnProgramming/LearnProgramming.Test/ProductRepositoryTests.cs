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
    public class ProductRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public ProductRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        }

        private ProductRepository CreateRepository()
        {
            return new ProductRepository(_databaseContext);
        }

        [Fact]
        public async void GetAll_ExistingProducts_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var product = _fixture
                .Build<Product>()
                .Create();

            await _databaseContext.AddAsync(product);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            Assert.Single(result);
            Assert.Equal(product.Name, result[0].Name);
            Assert.Equal(product.Publisher, result[0].Publisher);
            Assert.Equal(product.Language, result[0].Language);
            Assert.Equal(product.Description, result[0].Description);
            Assert.Equal(product.Price, result[0].Price);
            Assert.Equal(product.ReleaseDate, result[0].ReleaseDate);
            Assert.Equal(product.PageNumber, result[0].PageNumber);
            Assert.Equal(product.BookCoverType, result[0].BookCoverType);
            Assert.Equal(product.Photo, result[0].Photo);
        }

        [Fact]
        public async void Create_CreateProduct_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var product = _fixture
                .Create<Product>();

            var result = await repo.Create(product);

            var expected = await _databaseContext.Product.FirstAsync();

            Assert.Equal(expected.Name, result.Name);
            Assert.Equal(expected.Publisher, result.Publisher);
            Assert.Equal(expected.Language, result.Language);
            Assert.Equal(expected.Description, result.Description);
            Assert.Equal(expected.Price, result.Price);
            Assert.Equal(expected.ReleaseDate, result.ReleaseDate);
            Assert.Equal(expected.PageNumber, result.PageNumber);
            Assert.Equal(expected.BookCoverType, result.BookCoverType);
            Assert.Equal(expected.Photo, result.Photo);
        }

        [Fact]
        public async void Update_UpdateProduct_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var product = _fixture
                .Create<Product>();

            await _databaseContext.AddAsync(product);
            await _databaseContext.SaveChangesAsync();

            var newNameForProduct = _fixture.Create<string>();

            var productDto = new ProductDto
            {
                Name = newNameForProduct
            };

            product.Name = newNameForProduct;

            await repo.Update(productDto, product.Id);

            var expected = await _databaseContext.Product.FirstAsync();

            Assert.Equal(expected.Name, newNameForProduct);
        }

        [Fact]
        public async void Delete_DeletesProduct_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var product = _fixture
                .Create<Product>();

            await _databaseContext.AddAsync(product);
            await _databaseContext.SaveChangesAsync();

            await repo.Delete(product);

            var expected = await _databaseContext.Product.FirstOrDefaultAsync();

            Assert.Null(expected);
        }

        [Fact]
        public async void Get_GetProduct_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var product = _fixture.Create<Product>();

            await _databaseContext.AddAsync(product);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.Get(product.Id);

            Assert.Equal(product.Name, result.Name);
            Assert.Equal(product.Publisher, result.Publisher);
            Assert.Equal(product.Language, result.Language);
            Assert.Equal(product.Description, result.Description);
            Assert.Equal(product.Price, result.Price);
            Assert.Equal(product.ReleaseDate, result.ReleaseDate);
            Assert.Equal(product.PageNumber, result.PageNumber);
            Assert.Equal(product.BookCoverType, result.BookCoverType);
            Assert.Equal(product.Photo, result.Photo);
        }

        [Fact]
        public async void GetSuggestions_NumberOfProductsMoreThan4_ReturnsCorrectData()
        {
            var repository = CreateRepository();

            var products = _fixture.CreateMany<Product>(5).ToList();

            await _databaseContext.AddRangeAsync(products);
            await _databaseContext.SaveChangesAsync();

            var id = products.First().Id;

            var suggestions = await repository.GetSuggestions(id);

            Assert.Equal(3, suggestions.Count);
            Assert.True(!suggestions.Any(x => x.Id == id));
        }

        [Fact]
        public async void GetSuggestions_NumberOfProductsEquallyToFour_ReturnsCorrectData()
        {
            var repository = CreateRepository();

            var products = _fixture.CreateMany<Product>(4).ToList();

            await _databaseContext.AddRangeAsync(products);
            await _databaseContext.SaveChangesAsync();

            var id = products.First().Id;

            var suggestions = await repository.GetSuggestions(id);

            Assert.Equal(3, suggestions.Count);
            Assert.True(!suggestions.Any(x => x.Id == id));
        }

        [Fact]
        public async void GetSuggestions_NumberOfProductsFewerThan4_ReturnsCorrectData()
        {
            var repository = CreateRepository();

            var products = _fixture.CreateMany<Product>(2).ToList();

            await _databaseContext.AddRangeAsync(products);
            await _databaseContext.SaveChangesAsync();

            var id = products.First().Id;

            var suggestions = await repository.GetSuggestions(id);

            Assert.Single(suggestions);
            Assert.True(!suggestions.Any(x => x.Id == id));
        }
    }
}
