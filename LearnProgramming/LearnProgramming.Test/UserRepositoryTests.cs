using AutoFixture;
using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoUpdate;
using LearnProgramming.Domain.Entities;
using LearnProgramming.Domain.Enums;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace LearnProgramming.Test
{
    public class UserRepositoryTests
    {
        private readonly DatabaseContext _databaseContext;
        private readonly Fixture _fixture;

        public UserRepositoryTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .Options;

            _databaseContext = new DatabaseContext(dbContextOptions);
            _fixture = new Fixture();

            _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }

        private UserRepository CreateRepository()
        {
            return new UserRepository(_databaseContext);
        }

        [Fact]
        public async void GetByEmail_UserByEmail_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetByEmail(user.Email);

            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.Name, result.Name);
            Assert.Equal(user.Surname, result.Surname);
            Assert.Equal(user.UserName, result.UserName);
            Assert.Equal(user.Role, result.Role);
            Assert.Equal(user.City, result.City);
            Assert.Equal(user.School, result.School);
            Assert.Equal(user.Avatar, result.Avatar);
        }

        [Fact]
        public async void GetByUsername_UserByUsername_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetByUsername(user.UserName);

            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.Name, result.Name);
            Assert.Equal(user.Surname, result.Surname);
            Assert.Equal(user.UserName, result.UserName);
            Assert.Equal(user.Role, result.Role);
            Assert.Equal(user.City, result.City);
            Assert.Equal(user.School, result.School);
            Assert.Equal(user.Avatar, result.Avatar);
        }

        [Fact]
        public async void GetById_UserById_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetById(user.Id);

            Assert.Equal(user.Id, result.Id);
            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.Name, result.Name);
            Assert.Equal(user.Surname, result.Surname);
            Assert.Equal(user.UserName, result.UserName);
            Assert.Equal(user.Role, result.Role);
            Assert.Equal(user.City, result.City);
            Assert.Equal(user.School, result.School);
            Assert.Equal(user.Avatar, result.Avatar);
        }

        [Fact]
        public async void DeleteProfile_DeleteUser_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            await repo.DeleteProfile(user);

            var result = await _databaseContext.Users.FirstOrDefaultAsync();

            Assert.Null(result);
        }

        [Fact]
        public async void UpdateProfile_UserUpdateProfileInformation_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var newUserEmail = _fixture.Create<string>();

            var userUpdateDto = new UserUpdateDto
            {
                Email = newUserEmail
            };

            await repo.UpdateProfile(userUpdateDto, user.Id);

            var expected = await _databaseContext.Users.FirstAsync();

            Assert.Equal(expected.Email, newUserEmail);
        }

        [Fact]
        public async void UpdatePassword_UserUpdatePassword_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await _databaseContext.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            var newPasswordHash = _fixture.Create<byte[]>();
            var newPasswordSalt = _fixture.Create<byte[]>();

            var userPasswordUpdateDto = new UserPasswordUpdateDto
            {
                PasswordHash = newPasswordHash,
                PasswordSalt = newPasswordSalt,
            };

            await repo.UpdatePassword(userPasswordUpdateDto, user.Id);

            var expected = await _databaseContext.Users.FirstAsync();

            Assert.Equal(expected.PasswordHash, newPasswordHash);
            Assert.Equal(expected.PasswordSalt, newPasswordSalt);
        }

        [Fact]
        public async void PostStudent_TeacherAssignsStudent_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var teacher = _fixture.Build<User>()
                 .Without(x => x.Teacher)
                 .Without(x => x.Students)
                 .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            await _databaseContext.AddRangeAsync(student, teacher);

            await repo.PostStudent(relationship);

            var expected = await _databaseContext.TeacherAndStudent.FirstAsync();

            Assert.Equal(expected.TeacherId, relationship.TeacherId);
            Assert.Equal(expected.StudentId, relationship.StudentId);
            Assert.Equal(expected.Id, relationship.Id);

        }

        [Fact]
        public async void GetByIdStudent_StudentById_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var teacher = _fixture.Build<User>()
                 .Without(x => x.Teacher)
                 .Without(x => x.Students)
                 .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            await _databaseContext.AddRangeAsync(student, teacher, relationship);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetByIdStudent(relationship.StudentId);

            Assert.Equal(relationship.TeacherId, result!.TeacherId);
            Assert.Equal(relationship.StudentId, result.StudentId);
            Assert.Equal(relationship.Id, result.Id);
        }

        [Fact]
        public async void DeleteStudent_StudentDeletionFromListByTeacher_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var teacher = _fixture.Build<User>()
                 .Without(x => x.Teacher)
                 .Without(x => x.Students)
                 .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            await _databaseContext.AddRangeAsync(student, teacher, relationship);
            await _databaseContext.SaveChangesAsync();

            await repo.DeleteStudent(relationship);

            var expected = await _databaseContext.TeacherAndStudent.FirstOrDefaultAsync();

            Assert.Null(expected);
        }

        [Fact]
        public async void Register_RegistrationForUser_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var user = _fixture.Create<User>();

            await repo.Register(user);

            var expected = await _databaseContext.Users.FirstOrDefaultAsync();

            Assert.Equal(expected!.Id, user.Id);
            Assert.Equal(expected.Name, user.Name);
            Assert.Equal(expected.Surname, user.Surname);
            Assert.Equal(expected.UserName, user.UserName);
            Assert.Equal(expected.Avatar, user.Avatar);
            Assert.Equal(expected.City, user.City);
            Assert.Equal(expected.School, user.School);
        }

        [Fact]
        public async void GetTeacherAllStudents_AllStudentsThatAreAssignedToATeacher_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .Create();

            var teacher = _fixture.Build<User>()
                 .Without(x => x.Teacher)
                 .Without(x => x.Students)
                 .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            await _databaseContext.AddRangeAsync(student, teacher, relationship);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetTeacherAllStudents(relationship.TeacherId);

            Assert.Equal(result.First().Name, student.Name);
            Assert.Equal(result.First().Surname, student.Surname);
            Assert.Equal(result.First().Email, student.Email);
            Assert.Equal(result.First().Avatar, student.Avatar);
            Assert.Equal(result.First().Id, student.Id);
        }

        [Fact]
        public async void GetAllStudents_AllStudentsInTheSystemAndAssigned_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .With(x => x.Role, AllRoles.Student)
                .Create();

            var teacher = _fixture.Build<User>()
                 .Without(x => x.Teacher)
                 .Without(x => x.Students)
                 .With(x => x.Role, AllRoles.Teacher)
                 .Create();

            var relationship = _fixture.Build<TeacherAndStudent>()
                .With(x => x.TeacherId, teacher.Id)
                .With(x => x.StudentId, student.Id)
                .Without(x => x.Teacher)
                .Without(x => x.Student)
                .Create();

            await _databaseContext.AddRangeAsync(student, teacher, relationship);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAllStudents();

            var studentDto = (StudentDto)result.First();

           Assert.Equal(studentDto.Name, student.Name);
            Assert.Equal(studentDto.Surname, student.Surname);
            Assert.Equal(studentDto.Email, student.Email);
            Assert.Equal(studentDto.Avatar, student.Avatar);
            Assert.Equal(studentDto.Id, student.Id);
            Assert.Equal(studentDto.City, student.City);
            Assert.Equal(studentDto.School, student.School);
            Assert.True(studentDto.IsAssigned);
        }

        [Fact]
        public async void GetAllStudents_AllStudentsInTheSystemButNotAssigned_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .With(x => x.Role, AllRoles.Student)
                .Create();

            await _databaseContext.AddRangeAsync(student);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAllStudents();

            var studentDto = (StudentDto)result.First();

            Assert.Equal(studentDto.Name, student.Name);
            Assert.Equal(studentDto.Surname, student.Surname);
            Assert.Equal(studentDto.Email, student.Email);
            Assert.Equal(studentDto.Avatar, student.Avatar);
            Assert.Equal(studentDto.Id, student.Id);
            Assert.Equal(studentDto.City, student.City);
            Assert.Equal(studentDto.School, student.School);
            Assert.False(studentDto.IsAssigned);
        }

        [Fact]
        public async void GetAll_Admin_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var admin = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .With(x => x.Role, AllRoles.Admin)
                .Create();

            await _databaseContext.AddAsync(admin);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            var adminDto = (UserStatusDto)result.First();

            Assert.Equal(adminDto.Name, admin.Name);
            Assert.Equal(adminDto.Surname, admin.Surname);
            Assert.Equal(adminDto.Email, admin.Email);
            Assert.Equal(adminDto.Avatar, admin.Avatar);
            Assert.Equal(adminDto.City, admin.City);
            Assert.Equal(adminDto.School, admin.School);
            Assert.Equal("Administratorius", adminDto.Status);
        }

        [Fact]
        public async void GetAll_Teacher_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var teacher = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .With(x => x.Role, AllRoles.Teacher)
                .Create();

            await _databaseContext.AddAsync(teacher);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            var teacherDto = (UserStatusDto)result.First();

            Assert.Equal(teacherDto.Name, teacher.Name);
            Assert.Equal(teacherDto.Surname, teacher.Surname);
            Assert.Equal(teacherDto.Email, teacher.Email);
            Assert.Equal(teacherDto.Avatar, teacher.Avatar);
            Assert.Equal(teacherDto.City, teacher.City);
            Assert.Equal(teacherDto.School, teacher.School);
            Assert.Equal("Mokytojas", teacherDto.Status);
        }

        [Fact]
        public async void GetAll_StudentDoesNotHaveTeacher_ReturnsCorrectData()
        {
            var repo = CreateRepository();

            var student = _fixture.Build<User>()
                .Without(x => x.Teacher)
                .Without(x => x.Students)
                .With(x => x.Role, AllRoles.Student)
                .Create();

            await _databaseContext.AddAsync(student);
            await _databaseContext.SaveChangesAsync();

            var result = await repo.GetAll();

            var studentDto = (UserStatusDto)result.First();

            Assert.Equal(studentDto.Name, student.Name);
            Assert.Equal(studentDto.Surname, student.Surname);
            Assert.Equal(studentDto.Email, student.Email);
            Assert.Equal(studentDto.Avatar, student.Avatar);
            Assert.Equal(studentDto.City, student.City);
            Assert.Equal(studentDto.School, student.School);
            Assert.Equal("Nepriskirtas", studentDto.Status);
        }
    }
}
