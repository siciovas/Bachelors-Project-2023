using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IShippingInformationRep
    {
        Task<ShippingInformation> Create(ShippingInformation shippingInformation);
        Task<ShippingInformation> Update(ShippingInformation shippingInformation);
        Task<ShippingInformation?> Get(Guid userId);
    }
}
