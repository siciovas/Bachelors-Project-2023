using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Interfaces;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Domain.Enums;
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

        public async Task<List<UserDto>> GetAll()
        {
            Func<User, UserDto> student = user =>
            {
                var status = "";

                switch (user.Role)
                {
                    case AllRoles.Teacher:
                        status = "Mokytojas";
                        break;

                    case AllRoles.Admin:
                        status = "Administratorius";
                        break;

                    case AllRoles.Student:
                        var teacher = user.Teacher;

                        status = teacher != null ? $"{teacher.Teacher.Name} {teacher.Teacher.Surname}" : "Nepriskirtas";

                        break;
                }

                return new UserStatusDto
                {
                    Avatar = user.Avatar,
                    City = user.City,
                    Email = user.Email,
                    Name = user.Name,
                    Surname = user.Surname,
                    School = user.School,
                    Status = status
                };
            };

            var users = await _db.Users.Include(u => u.Teacher).Select(user => student(user)).ToListAsync();

            return users;
        }

        public async Task<List<UserDto>> GetAllStudents()
        {
            var students = await _db.Users.Where(user => user.Role == AllRoles.Student).Select(student => new StudentDto
            {
                Id = student.Id,
                Avatar = student.Avatar,
                City = student.City,
                Email = student.Email,
                Name = student.Name,
                Surname = student.Surname,
                School = student.School,
                IsAssigned = _db.TeacherAndStudent.Any(relation => relation.StudentId == student.Id),
            }).ToListAsync();

            return students.Cast<UserDto>().ToList();
        }

        public async Task<List<TeachersAllStudentsDto>> GetTeacherAllStudents(Guid id)
        {
            var students = await _db.Users.Include(user => user.Students).Where(user => user.Id == id).SelectMany(teacher => teacher.Students.Select(student => new TeachersAllStudentsDto
            {
                Id = student.StudentId,
                Avatar = student.Student.Avatar,
                Email = student.Student.Email,
                Name = student.Student.Name,
                Surname = student.Student.Surname,

            })).ToListAsync();

            return students;
        }

        public async Task<User> GetByEmail(string email)
        {
            var users = await _db.Users.ToListAsync();

            var user = await _db.Users.FirstOrDefaultAsync(user => user.Email == email);

            return user;
        }

        public async Task<User> GetByUsername(string username)
        {
            var users = await _db.Users.ToListAsync();

            var user = await _db.Users.FirstOrDefaultAsync(user => user.UserName == username);

            return user;
        }

        public async Task<User> GetById(Guid id)
        {
            var user = await _db.Users.FirstAsync(user => user.Id == id);

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

        public async Task DeleteStudent(TeacherAndStudent student)
        {
            _db.TeacherAndStudent.Remove(student);
            await _db.SaveChangesAsync();
        }

        public async Task<TeacherAndStudent> PostStudent(TeacherAndStudent student)
        {
            _db.TeacherAndStudent.Add(student);
            await _db.SaveChangesAsync();

            return student;

        }

        public async Task<TeacherAndStudent?> GetByIdStudent(Guid id)
        {
            var student = await _db.TeacherAndStudent.FirstOrDefaultAsync(student => student.StudentId == id);

            return student;
        }

        public async Task DeleteProfile(User user)
        {
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
        }
    }
}
