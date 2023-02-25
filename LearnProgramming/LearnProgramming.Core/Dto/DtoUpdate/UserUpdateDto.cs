using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto.DtoUpdate
{
    public class UserUpdateDto
    {
        public byte[] Avatar { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string School { get; set; }
    }
}
