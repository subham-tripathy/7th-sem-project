import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CompanyHomePageCard() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/company/features", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === "success") {
          setFeatures(response.data.features);
        } else {
          setError("Failed to fetch features");
        }
      } catch (err) {
        console.error("Error fetching features:", err);
        setError("Error fetching features. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading features...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-danger">{error}</div>;
  }

  return (
    <>
      {features.map((feature) => (
        <div
          key={feature.id}
          style={{ minWidth: "300px", maxWidth: "400px", border: "1px solid cyan" }}
          className="bg-secondary text-center px-4 py-3 rounded m-2"
        >
          <h3 style={{ textShadow: "1px 1px black" }}>{feature.title}</h3>
          <hr className="border border-white" />
          <Link
            to={feature.url}
            style={{ textDecoration: "none" }}
            className="btn btn-primary shadow border"
          >
            {feature.urlText || "Use This Feature"}
          </Link>
        </div>
      ))}
    </>
  );
}
