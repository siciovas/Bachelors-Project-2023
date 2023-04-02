using LearnProgramming.Core.Dto;
using LearnProgramming.Core.Dto.DtoUpdate;
using LearnProgramming.Domain.Entities;

namespace LearnProgramming.Core.Interfaces
{
    public interface IUserRep
    {
        Task<User> GetByEmail(string email);
        Task<User> GetByUsername(string username);
        Task<List<UserDto>> GetAll();
        Task<List<UserDto>> GetAllStudents();
        Task<List<TeachersAllStudentsDto>> GetTeacherAllStudents(Guid id);
        Task<User> GetById(Guid id);
        Task<User> Register(User user);
        Task<User> UpdateProfile(UserUpdateDto user, Guid id);
        Task<User> UpdatePassword(UserPasswordUpdateDto user, Guid id);
        Task DeleteStudent(TeacherAndStudent student);
        Task<TeacherAndStudent> PostStudent(TeacherAndStudent student);
        Task<TeacherAndStudent?> GetByIdStudent(Guid id);
        Task DeleteProfile(User user);
    }
}
