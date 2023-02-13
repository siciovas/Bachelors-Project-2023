using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IUserRep
    {
        Task<User> GetByEmail(string email);
        Task<User> GetByUsername(string username);
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(Guid id);
        Task<User> Register(User user);
    }
}
