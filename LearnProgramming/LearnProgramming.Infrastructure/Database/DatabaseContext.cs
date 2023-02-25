using LearnProgramming.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Infrastructure.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<LearningTopic> LearningTopics { get; set; }
        public DbSet<SubTopic> SubTopics { get; set; }
        public DbSet<TaskInfo> Task { get; set; }
        public DbSet<Shop> ShopItem { get; set; }
    }
}
