namespace LearnProgramming.Domain.Entities
{
    public class ShippingInformation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty!;
        public string Surname { get; set; } = string.Empty!;
        public string Email { get; set; } = string.Empty!;
        public string RepeatEmail { get; set; } = string.Empty!;
        public string PhoneNumber { get; set; } = string.Empty!;
        public string Street { get; set; } = string.Empty!;
        public string Address { get; set; } = string.Empty!;
        public string ZipCode { get; set; } = string.Empty!;
        public string City { get; set; } = string.Empty!;
        public string Region { get; set; } = string.Empty!;
        public User User { get; set; }
        public Guid UserId { get; set; }
    }
}
