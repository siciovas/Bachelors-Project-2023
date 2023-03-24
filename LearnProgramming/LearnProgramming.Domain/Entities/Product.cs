using LearnProgramming.Domain.Enums;

namespace LearnProgramming.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public byte[] Photo { get; set; }
        public string Name { get; set; } = string.Empty!;
        public double Price { get; set; }
        public string Description { get; set; } = string.Empty!;
        public int PageNumber { get; set; }
        public string Language { get; set; } = string.Empty!;
        public BookCover BookCoverType { get; set; }
        public string Publisher { get; set; } = string.Empty!;
        public string ReleaseDate { get; set; }
    }
}
