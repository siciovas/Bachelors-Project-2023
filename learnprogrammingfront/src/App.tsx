import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
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
import { Task } from './Pages/Task';


function App() {

  const theme = extendTheme({
    components: {
      Steps,
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <div className="App" style={{ height: '100vh' }}>
        <BrowserRouter>
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
            <Route path="/uzdaviniai" element={<LearningSubTopics/>}/>
            <Route path="/preke" element={<ShopItemPage/>} />
            <Route path="/uzd" element={<Task/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;

