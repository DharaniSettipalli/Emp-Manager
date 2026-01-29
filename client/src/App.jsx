import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedLayout from './layouts/ProtectedLayout'
import AddEmployeePage from './pages/AddEmployeePage'
import AllEmployeePage from './pages/AllEmployeePage/index'
import UpdateEmployeePage from './pages/UpdateEmployeePage'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<ProtectedLayout/>}>
          <Route path="/" Component={DashboardPage} />
          <Route path="/add-employee" Component={AddEmployeePage} />
          <Route path="/all-employee" Component={AllEmployeePage} />
          <Route path="/update-employee/:id" Component={UpdateEmployeePage} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
