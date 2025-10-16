export default function SearchStudentResultCard({ student }) {
  return (
    // <div className="bg-secondary-subtle text-center p-4 border border-white rounded-3">
    //   <img
    //     src="https://i.pinimg.com/736x/c0/c2/16/c0c216b3743c6cb9fd67ab7df6b2c330.jpg"
    //     alt="profile pic"
    //     style={{ maxHeight: "150px", maxWidth: "150px", backgroundColor: "white", borderRadius: "50%" }}
    //   />
    //   <h2>{name}</h2>
    //   <h5>{id}</h5>
    //   <p>{techStack}</p>
    //   <button className="btn btn-primary m-0">View Student Profile</button>
    // </div>
    <div className="bg-secondary-subtle text-center p-4 border border-white rounded-3">
      <img
        src="https://i.pinimg.com/736x/c0/c2/16/c0c216b3743c6cb9fd67ab7df6b2c330.jpg"
        alt="profile pic"
        style={{ maxHeight: "150px", maxWidth: "150px", backgroundColor: "white", borderRadius: "50%" }}
      />
      <h3>{student.regnNo}</h3>
      <h3>{student.rollNo}</h3>
      <h3>{student.programme}</h3>
      <h3>{student.branch}</h3>
      <h3>{student.name}</h3>
      <h3>{student.gender}</h3>
      <h3>{student.email}</h3>
      {/* <button className="btn btn-primary m-0">View Student Profile</button> */}
    </div>
  );
}
