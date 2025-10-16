import { Link } from "react-router-dom";
export default function CompanyHomePageCard({ title, urlText, url }) {
  return (
    <div
      style={{ minWidth: "300px", maxWidth: "400px", border: "1px solid cyan" }}
      className="bg-secondary text-center px-4 py-3 rounded m-2"
    >
      <h3 style={{ textShadow: "1px 1px black" }}>{title}</h3>
      <hr className="border border-white" />
      <Link
        to={url}
        style={{ textDecoration: "none" }}
        className="btn btn-primary shadow border"
      >
        Use This Feature
      </Link>
    </div>
  );
}
