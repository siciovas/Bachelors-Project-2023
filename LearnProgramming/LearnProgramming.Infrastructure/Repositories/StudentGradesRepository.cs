using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoUpdate;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace LearnProgramming.Infrastructure.Repositories
{
    public class StudentGradesRepository : IStudentGradesRep
    {
        private readonly DatabaseContext _db;

        public StudentGradesRepository(DatabaseContext db)
        {
            _db = db;
        }

        public async Task<StudentGrades> Create(StudentGrades studentGrades)
        {
            _db.Add(studentGrades);
            await _db.SaveChangesAsync();
            return studentGrades; 
        }

        public async Task<StudentGrades?> Get(int id)
        {
            return await _db.StudentGrades
               .Where(grade => grade.ProgrammingTaskId == id)
               .FirstOrDefaultAsync();
        }

        public async Task<List<StudentGrades>> GetAllByStudent(Guid id)
        {
            var grades = await _db.StudentGrades
                .Include(x => x.User)
                .Include(x => x.ProgrammingTask)
                .ThenInclude(x => x.SubTopic)
                .ThenInclude(x => x.LearningTopic)
                .Where(x => x.UserId == id)
                .ToListAsync();

            return grades;
        }

        public async Task<List<StudentGradesForTeacherDto>> GetAllByTeacher(Guid id)
        {
            var grades = await _db.Users
                .Include(x => x.Teacher)
                .Where(x => x.Teacher!.TeacherId == id)
                .Select(x => new StudentGradesForTeacherDto
                {
                    Name = x.Name,
                    Surname = x.Surname,
                    Grades = _db.StudentGrades
                     .Include(grade => grade.ProgrammingTask)
                     .ThenInclude(grade => grade.SubTopic)
                     .ThenInclude(grade => grade.LearningTopic)
                     .Where(grade => grade.UserId == x.Id)
                     .Select(grade => new StudentGradesDto
                     {
                         Topic = grade.ProgrammingTask.SubTopic.LearningTopic.Title,
                         SubTopic = grade.ProgrammingTask.SubTopic.SubTopicName,
                         Task = grade.ProgrammingTask.Name,
                         Grade = grade.Grade
                     })
                     .ToList()
                })
                .ToListAsync();

            return grades;
        }

        public async Task<StudentGrades> Update(StudentGradesUpdateDto studentGradesDto, int id)
        {
            var grades = await _db.StudentGrades
                 .AsTracking()
                 .FirstAsync(x => x.ProgrammingTaskId == id);

            grades.Grade = studentGradesDto.Grade;

            await _db.SaveChangesAsync();

            return grades;
        }
    }
}
