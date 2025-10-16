import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{border:"3px solid red", width:"50%"}} className="text-center p-44 mx-auto p-5 rounded mt-5">
      <h1>Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
}
