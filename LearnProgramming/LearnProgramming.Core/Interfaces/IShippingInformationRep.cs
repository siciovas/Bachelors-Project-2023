using LearnProgramming.Core.Dto.DtoPost;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IShippingInformationRep
    {
        Task<ShippingInformation> Create(ShippingInformation shippingInformation);
        Task<ShippingInformation> Update(ShippingInformationPostDto shippingInformation, Guid userId);
        Task<ShippingInformation?> Get(Guid userId);
    }
}
