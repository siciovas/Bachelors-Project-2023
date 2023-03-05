using LearnProgramming.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto.DtoPost
{
    public class LearningTopicsPostDto
    {
        public byte[] Photo { get; set; } 
        public string Title { get; set; } = string.Empty!;
        public Difficulty DifficultyInText { get; set; }
    }
}
