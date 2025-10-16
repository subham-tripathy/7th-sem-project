import { useState } from "react";

export default function CompanyAddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job post submitted:");
    console.log({
      title,
      description,
      location,
      salary,
      jobType,
      requirements,
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Create a Job Post</h2>
      <form
        className="my-5 border border-2 border-primary shadow mx-auto p-5 pt-4 rounded"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary (optional)</label>
          <input
            type="text"
            className="form-control"
            name="salary"
            value={salary}
            onChange={(e) => {
              setSalary(e.target.value);
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Job Type</label>
          <select
            className="form-select"
            name="jobType"
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
            }}
          >
            <option value={"Full-time"}>Full-time</option>
            <option value={"Part-time"}>Part-time</option>
            <option value={"Contract"}>Contract</option>
            <option value={"Internship"}>Internship</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Requirements</label>
          <textarea
            className="form-control"
            name="requirements"
            rows="3"
            value={requirements}
            onChange={(e) => {
              setRequirements(e.target.value);
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Post Job
        </button>
      </form>
    </div>
  );
}
