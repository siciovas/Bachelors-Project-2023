using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using LearnProgramming.Core.Interfaces;

namespace LearnProgramming.Infrastructure.Services
{
    public class HashService : IHashServ
    {
        private static readonly Encoding HashEncoding = Encoding.UTF8;

        public HashPasswordResponse HashPassword(string password)
        {
            using var Hmac = new HMACSHA256();

            var resp = new HashPasswordResponse
                (PasswordHash: Hmac.ComputeHash(HashEncoding.GetBytes(password)),
                 PasswordSalt: Hmac.Key);

            return resp;
        }
    }
}
