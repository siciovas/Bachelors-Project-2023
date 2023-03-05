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

        public async Task<ShippingInformation> Update(ShippingInformation shippingInformation)
        {
            _db.Update(shippingInformation);
            await _db.SaveChangesAsync();

            return shippingInformation;
        }
    }
}
