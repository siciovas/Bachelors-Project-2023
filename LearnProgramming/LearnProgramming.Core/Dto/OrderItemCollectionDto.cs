using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class OrderItemCollectionDto
    {
        public string Name { get; set; }
        public int Quantity { get; set; } = 1;
        public int ProductId { get; set; }
    }
}
