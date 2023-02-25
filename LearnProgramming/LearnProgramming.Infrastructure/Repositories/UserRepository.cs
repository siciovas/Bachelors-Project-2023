using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class UserRepository : IUserRep
    {
        private readonly DatabaseContext _db;

        public UserRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            var users = await _db.Users.ToListAsync();

            return users;
        }

        public async Task<User> GetByEmail(string email)
        {
            var users = await _db.Users.ToListAsync();

            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == email);

            return user;
        }

        public async Task<User> GetByUsername(string username)
        {
            var users = await _db.Users.ToListAsync();

            var user = await _db.Users.FirstOrDefaultAsync(x => x.UserName == username);

            return user;
        }

        public async Task<User> GetById(Guid id)
        {
            var user = await _db.Users.FirstAsync(x => x.Id == id);

            return user;
        }

        public async Task<User> Register(User user)
        {
            _db.Users.Add(user);

            await _db.SaveChangesAsync();

            return user;
        }

        public async Task<User> Update(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return user;
        }
    }
}
