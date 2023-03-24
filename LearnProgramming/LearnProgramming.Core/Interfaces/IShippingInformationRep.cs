using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IShippingInformationRep
    {
        Task<ShippingInformation> Create(ShippingInformation shippingInformation);
        Task<ShippingInformation> Update(ShippingInformation shippingInformation);
        Task<ShippingInformation?> Get(Guid userId);
    }
}
