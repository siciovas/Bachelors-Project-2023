using LearnProgramming.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<LearningTopic> LearningTopics { get; set; }
        public DbSet<SubTopic> SubTopics { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<ShippingInformation> ShippingInformation { get; set; }
        public DbSet<Submission> Submission { get; set; }
        public DbSet<TeacherAndStudent> TeacherAndStudent { get; set; }
        public DbSet<ProgrammingTask> ProgrammingTasks { get; set; }
        public DbSet<ProgrammingTaskTest> ProgrammingTaskTests { get; set; }
        public DbSet<StudentGrades> StudentGrades { get; set; }
    }
}
