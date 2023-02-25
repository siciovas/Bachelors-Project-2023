using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Domain.Entities
{
    public class Shop
    {
        public int Id { get; set; }
        public byte[] Photo { get; set; }
        public string Name { get; set; } = string.Empty!;
        public double Price { get; set; }
        public string Description { get; set; } = string.Empty!;
        public int PageNumber { get; set; }
        public string Language { get; set; } = string.Empty!;
        public string BookCoverType { get; set; } = string.Empty!;
        public string Publisher { get; set; } = string.Empty!;
        public string ReleaseDate { get; set; }
    }
}
