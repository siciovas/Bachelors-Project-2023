using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto
{
    public class SubmissionDto
    {
        public int Id { get; set; }
        public string Topic { get; set; } = string.Empty!;
        public string Message { get; set; } = string.Empty!;
       
    } 
}
