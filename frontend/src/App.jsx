import { useEffect } from "react";
import HeroSection from "./components/herosection";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("placementHubUser");
    if (user != null) {
      const decodedUser = jwtDecode(user);
      if (decodedUser.role == "company") navigate("/companyhome");
    }
  }, []);
  return (
    <>
      <HeroSection />
    </>
  );
}
