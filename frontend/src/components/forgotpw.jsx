import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail } from "./functions";

export default function ForgetPW() {
  const [email, setEmail] = useState("");
  const [pw, setPW] = useState("");
  const [cpw, setCPW] = useState("");
  const otpRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.textContent == "Send OTP") {
      if (email.length == 0) return toast.error("Email shouldn't be empty");
      if (!validateEmail(email)) return toast.error("Invalid Email");
      if (pw.length == 0)
        return toast.error("Password Field shouldn't be empty");
      if (cpw.length == 0)
        return toast.error("Confirm Password Field shouldn't be empty");
      toast.success("OTP sent to email");
      e.target.textContent = "Verify OTP";
      otpRef.current.disabled = false;
    } else {
      console.log(otpRef.current.value);
      if (validateOTP(otpRef.current.value))
        toast.success("Password Reset Success");
      else toast.error("Invalid OTP");
    }
  };
  return (
    <form
      style={{ width: "55%" }}
      className="mt-5 border border-2 border-primary shadow form mx-auto text-center p-5 pt-4 rounded"
    >
      <h1 className="text-center underline">Reset Your Password</h1>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="text"
        className="form-control"
        placeholder="Enter Email:"
      />
      <br />
      <input
        value={pw}
        onChange={(e) => {
          setPW(e.target.value);
        }}
        type="text"
        className="form-control"
        placeholder="Enter New Password:"
      />
      <br />
      <input
        value={cpw}
        onChange={(e) => {
          setCPW(e.target.value);
        }}
        type="text"
        className="form-control"
        placeholder="Confirm New Password:"
      />
      <br />
      <input
        ref={otpRef}
        type="number"
        className="form-control"
        disabled={true}
        placeholder="Enter OTP:"
      />
      <br />
      <div className="d-flex justify-content-between invisible">
        <Link to={"/forgot-password"}>Forgot Password?</Link>
        <Link to={"/register"}>Create New Account</Link>
      </div>
      <br />
      <button
        onClick={handleSubmit}
        style={{ width: "100%" }}
        className="btn btn-primary"
      >
        Send OTP
      </button>
      <br />
    </form>
  );
}
