using LearnProgramming.Core.Interfaces;
using LearnProgramming.Infrastructure.Database;
using LearnProgramming.Infrastructure.Repositories;
using LearnProgramming.Infrastructure.Services;
using LearnProgramming.Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Cors", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var jwt = new JwtSettings();
builder.Configuration.GetSection(JwtSettings.SectionName).Bind(jwt);

builder.Services.AddSingleton(jwt);
builder.Services.AddTransient<IJwtServ, JwtService>();
builder.Services.AddTransient<IHashServ, HashService>();
builder.Services.AddTransient<IUserRep, UserRepository>();
builder.Services.AddTransient<ILearningTopicsRep, LearningTopicsRepository>();
builder.Services.AddTransient<ISubTopicsRep, SubTopicsRepository>();
builder.Services.AddTransient<IProductRep, ProductRepository>();
builder.Services.AddTransient<IShoppingCartItemRep, ShoppingCartItemRepository>();
builder.Services.AddTransient<IShippingInformationRep, ShippingInformationRepository>();
builder.Services.AddTransient<IOrderRep, OrderRepository>();
builder.Services.AddTransient<IOrderItemRep, OrderItemRepository>();
builder.Services.AddTransient<ISubmissionRep, SubmissionRepository>();
builder.Services.AddTransient<IProgrammingTaskRep, ProgrammingTaskRepository>();
builder.Services.AddTransient<IStudentGradesRep, StudentGradesRepository>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var jwtSettings = builder.Services.BuildServiceProvider().GetService<JwtSettings>();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwt!.Secret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        RequireExpirationTime = true,
        ValidateLifetime = true,
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseCors("Cors");
app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();
app.MapRazorPages();
app.Run();
