using System.ComponentModel.DataAnnotations.Schema;

namespace LearnProgramming.Domain.Entities
{
    public class TeacherAndStudent
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Teacher)), Column(Order = 0)]
        public Guid TeacherId { get; set; }

        [ForeignKey(nameof(Student)), Column(Order = 1)]
        public Guid StudentId { get; set; }

        public User Teacher { get; set; }
        public User Student { get; set; }
    }
}