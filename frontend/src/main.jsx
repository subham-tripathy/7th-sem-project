import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.jsx";
import NavBar from "./components/navbar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NotFound from "./components/notfounds.jsx";
import Register from "./components/register.jsx";
import Home from "./components/home.jsx";
import SearchStudent from "./components/companySearchStudent.jsx";
import SearchStudentResult from "./components/companySearchStudentResult.jsx";
import ForgetPW from "./components/forgotpw.jsx";
import CompanyHomePage from "./components/companyHomePage.jsx";
import CompanyAddPost from "./components/companyAddPost.jsx";
import About from "./components/about.jsx";
import StudentHomePage from "./components/StudentHome.jsx";
import TnPHomePage from "./components/tnpHomePage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NavBar />
    <ToastContainer />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/home" element={<Home />} />
      <Route path="/studenthome" element={<StudentHomePage />} />
      <Route path="/companyhome" element={<CompanyHomePage />} />
      <Route path="/tnphome" element={<TnPHomePage />} />
      <Route path="/company/searchStudent" element={<SearchStudent />} />
      <Route
        path="/company/searchStudentResult"
        element={<SearchStudentResult />}
      />
      <Route path="/company/createPost" element={<CompanyAddPost />} />
      <Route path="/forgot-password" element={<ForgetPW />} />
      <Route
        path="/company/searchStudentResult"
        element={<SearchStudentResult />}
      />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
