using LearnProgramming.Core.Dto;
using LearnProgramming.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Interfaces
{
    public interface IJwtServ
    {
        public string BuildJwt(User user);
    }
}
