namespace LearnProgramming.Infrastructure.Settings
{
    public class JwtSettings
    {
        public string Secret { get; set; }
        public TimeSpan TokenLifeTime { get; set; }
        public static string SectionName => "JwtSettings";
    }
}
