using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class ShopDto
    {
        public byte[] Photo { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public int PageNumber { get; set; }
        public string Language { get; set; }
        public string BookCoverType { get; set; }
        public string Publisher { get; set; }
        public string ReleaseDate { get; set; }
    }
}
