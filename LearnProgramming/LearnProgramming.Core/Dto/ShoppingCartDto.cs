using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class ShoppingCartDto
    {
        private double _CartPrice;
        public double CartPrice
        { get
            {
                return _CartPrice;
            }
            set
            {
                _CartPrice = value;
                TotalPrice = value + Shipping;
            } 
        }
        public double Shipping { get; set; } = 3.50;
        public double TotalPrice { get; set; }

        public List<ShoppingCartItemDto> ShoppingCartItems { get; set; }
    }
}
