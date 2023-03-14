import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../Constants/RolesConstants";
import { AdminNavbar } from "./AdminNavbar";
import { GuestNavbar } from "./GuestNavbar";
import { StudentNavbar } from "./StudentNavbar";
import { TeacherNavbar } from "./TeacherNavbar";

const NavBar = () => {
  useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  
  return (
    <>
      {!token ? (
        <>
          <GuestNavbar />
        </>
      ) : (
        <>
          {(role === UserRole.Student && (
            <>
              <StudentNavbar />
            </>
          )) ||
            (role === UserRole.Admin && (
              <>
                <AdminNavbar />
              </>
            )) ||
            (role === UserRole.Teacher && (
              <>
                <TeacherNavbar />
              </>
            ))}
        </>
      )}
    </>
  );
};

export { NavBar };
