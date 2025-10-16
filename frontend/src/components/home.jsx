import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("placementHubUser")
    if (user != null) {
      const decodedUser = jwtDecode(user);
      if (decodedUser.role == "company")
        navigate("/companyhome")
    }
  }, [])
  return (
    <>
      <h1>This is Home Page</h1>
      {/* <CompanyHomePage /> */}
    </>
  );
}
