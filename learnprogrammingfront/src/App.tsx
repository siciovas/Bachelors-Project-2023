import React, { useCallback, useEffect } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { StepsTheme as Steps } from 'chakra-ui-steps';
import { NavBar } from "./Components/Navbars/Navbar";
import { LearningTopics } from './Pages/LearningTopics';
import { HomePage } from './Pages/HomePage';
import { Shop } from './Pages/Shop';
import { Profile } from './Components/Profile';
import { RegisterPage } from './Components/RegisterPage';
import { ShoppingCart } from './Pages/ShoppingCart';
import { ForgotPassword } from './Components/ForgotPassword';
import { LoginPage } from './Components/LoginPage';
import { LearningSubTopics } from './Pages/LearningSubTopics';
import { ShopItemPage } from './Pages/ShopItemPage';
import { ProgrammingTasksList } from './Pages/ProgrammingTasksList';
import { GetMySubmissions } from './Pages/GetMySubmissions';
import eventBus from './Helpers/EventBus';
import { Unauthorized } from './Constants/Auth';
import { ProgrammingTask } from './Pages/ProgrammingTask';
import { AddNewProgrammingTask } from './Components/AddNewProgrammingTask';
import { GetAllSubmissionsForAdmin } from './Pages/GetAllSubmissionsForAdmin';
import { GetAllUsersForAdmin } from './Pages/GetAllUsersForAdmin';
import { StudentsMarksForTeacher } from './Pages/StudentsMarksForTeacher';
import { ChooseStudentForTeacher } from './Pages/ChooseStudentForTeacher';
import { StudentsMarks } from './Pages/StudentsMarks';
import { OrderHistory } from './Pages/OrderHistory';
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";
import { TeacherStudents } from './Pages/TeacherStudents';
import { PayseraSuccessfully } from './Pages/PayseraSuccessfully';


function App() {
  const navigate = useNavigate();

  const theme = extendTheme({
    components: {
      Steps,
    },
  });

  const logOut = useCallback((data: any) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate("/");
    if (data === Unauthorized) {
      toast.error("Baigėsi sesijos laikas. Prisijunkite")
    }
  }, []);

  useEffect(() => {
    eventBus.on("logOut", (data: any) => {
      logOut(data);
    })

    return () => {
      eventBus.remove("logOut", (data: any) => {
        logOut(data);
      });
    }
  }, [logOut])

  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <Toaster/>
        <NavBar />
        <Routes>
          <Route path="/" element={< HomePage />} />
          <Route path="/prisijungimas" element={<LoginPage />} />
          <Route path="/registracija" element={<RegisterPage />} />
          <Route path="/kursai" element={< LearningTopics />} />
          <Route path="/parduotuve" element={<Shop />} />
          <Route path="/paskyra" element={<Profile />} />
          <Route path="/krepselis" element={<ShoppingCart />} />
          <Route path="/atkurimas" element={<ForgotPassword />} />
          <Route path="/potemes" element={<LearningSubTopics />} />
          <Route path="/preke" element={<ShopItemPage />} />
          <Route path="/uzduotys" element={<ProgrammingTasksList />} />
          <Route path="/manoprasymai" element={<GetMySubmissions />} />
          <Route path='/uzduotis' element={<ProgrammingTask />} />
          <Route path='/kurtiuzduoti' element={<AddNewProgrammingTask/>} />
          <Route path='/prasymai' element={<GetAllSubmissionsForAdmin/>} />
          <Route path='/visinariai' element={<GetAllUsersForAdmin/>} />
          <Route path='/studentuivertinimai' element={<StudentsMarksForTeacher/>} />
          <Route path='/studentusarasas' element={<ChooseStudentForTeacher/>} />
          <Route path='/manopazymiai' element={<StudentsMarks/>} />
          <Route path='/manouzsakymai' element={<OrderHistory/>} />
          <Route path='/manostudentai' element={<TeacherStudents/>} />
          <Route path='/sekmingasuzsakymas' element={<PayseraSuccessfully/>} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;

