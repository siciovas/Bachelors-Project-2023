using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnProgramming.Core.Dto.DtoPost
{
    public class ProgrammingTaskPostDto
    {
        public string Name { get; set; } = string.Empty!;
        public string Description { get; set; } = string.Empty!;
        public string DataAndAnswers { get; set; } = string.Empty!;
        public byte[]? AdditionalInformation { get; set; }
    }
}
