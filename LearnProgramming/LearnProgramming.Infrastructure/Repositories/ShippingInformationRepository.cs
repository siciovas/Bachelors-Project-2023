using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class ShippingInformationRepository : IShippingInformationRep
    {
        private readonly DatabaseContext _db;

        public ShippingInformationRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<ShippingInformation> Create(ShippingInformation shippingInformation)
        {
            _db.Add(shippingInformation);
            await _db.SaveChangesAsync();

            return shippingInformation;
        }

        public async Task<ShippingInformation?> Get(Guid userId)
        {
            return await _db.ShippingInformation.FirstOrDefaultAsync(x => x.UserId == userId);
        }

        public async Task<ShippingInformation> Update(ShippingInformationPostDto shippingInformationDto, Guid userId)
        {
            var shippingInformation = await _db.ShippingInformation
                .AsTracking()
                .FirstAsync(x => x.UserId == userId);

            shippingInformation.Name = shippingInformationDto.Name;
            shippingInformation.Surname = shippingInformationDto.Surname;
            shippingInformation.Email = shippingInformationDto.Email;
            shippingInformation.RepeatEmail = shippingInformationDto.RepeatEmail;
            shippingInformation.Address = shippingInformationDto.Address;
            shippingInformation.City = shippingInformationDto.City;
            shippingInformation.Region = shippingInformationDto.Region;
            shippingInformation.Street = shippingInformationDto.Street;
            shippingInformation.ZipCode = shippingInformationDto.ZipCode;

            await _db.SaveChangesAsync();

            return shippingInformation;
        }
    }
}
