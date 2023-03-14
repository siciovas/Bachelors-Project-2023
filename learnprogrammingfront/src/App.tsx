import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ChakraProvider, extendTheme, useToast } from '@chakra-ui/react'
import { StepsTheme as Steps } from 'chakra-ui-steps';
import { NavBar } from "./Components/Navbars/Navbar";
import { LearningTopics } from './Pages/LearningTopics';
import { HomePage } from './Pages/HomePage';
import { Shop } from './Pages/Shop';
import { Profile } from './Components/Profile';
import { RegisterPage } from './Components/RegisterPage';
import { ShoppingCart } from './Pages/ShoppingCart';
import { Submissions } from './Pages/Submissions';
import { ForgotPassword } from './Components/ForgotPassword';
import { LoginPage } from './Components/LoginPage';
import { LearningSubTopics } from './Pages/LearningSubTopics';
import { ShopItemPage } from './Pages/ShopItemPage';
import { ProgrammingTasksList } from './Pages/ProgrammingTasksList';
import { GetMySubmissions } from './Components/GetMySubmissions';
import eventBus from './Helpers/EventBus';
import { Unauthorized } from './Constants/Auth';
import { ProgrammingTask } from './Pages/ProgrammingTask';


function App() {
  const toast = useToast();
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
      toast({
        title: "Baigėsi sesijos laikas. Prisijunkite",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
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
      <div className="App" style={{ height: '100vh' }}>
        <NavBar />
        <Routes>
          <Route path="/" element={< HomePage />} />
          <Route path="/prisijungimas" element={<LoginPage />} />
          <Route path="/registracija" element={<RegisterPage />} />
          <Route path="/kursai" element={< LearningTopics />} />
          <Route path="/parduotuve" element={<Shop />} />
          <Route path="/paskyra" element={<Profile />} />
          <Route path="/krepselis" element={<ShoppingCart />} />
          <Route path="/prasymai" element={<Submissions />} />
          <Route path="/atkurimas" element={<ForgotPassword />} />
          <Route path="/potemes" element={<LearningSubTopics />} />
          <Route path="/preke" element={<ShopItemPage />} />
          <Route path="/uzduotys" element={<ProgrammingTasksList />} />
          <Route path="/manoprasymai" element={<GetMySubmissions />} />
          <Route path='/uzduotis' element={<ProgrammingTask />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;

