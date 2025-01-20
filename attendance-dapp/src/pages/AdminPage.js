import React, { useState } from "react";

const AdminPage = ({ contract, accounts }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [teacherAddress, setTeacherAddress] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [classDateTime, setClassDateTime] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [assignTeacherSubjectId, setAssignTeacherSubjectId] = useState("");
  const [assignTeacherAddress, setAssignTeacherAddress] = useState("");
  const [enrollSubjectId, setEnrollSubjectId] = useState("");
  const [enrollStudentAddress, setEnrollStudentAddress] = useState("");
  const [searchStudentAddress, setSearchStudentAddress] = useState("");
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [searchTeacherAddress, setSearchTeacherAddress] = useState("");
  const [searchedTeacher, setSearchedTeacher] = useState(null);
  const [searchSubjectId, setSearchSubjectId] = useState("");
  const [searchedSubject, setSearchedSubject] = useState(null);

  const addStudent = async () => {
    if (!studentName || !studentAddress) {
      alert("Please enter both the student's name and address.");
      return;
    }

    try {
      await contract.methods
        .addStudent(studentAddress, studentName)
        .send({ from: accounts[0] });
      alert(`Student ${studentName} added successfully!`);
      setStudentName("");
      setStudentAddress("");
      viewStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  const addTeacher = async () => {
    if (!teacherName || !teacherAddress) {
      alert("Please enter both the teacher's name and address.");
      return;
    }

    try {
      await contract.methods
        .addTeacher(teacherAddress, teacherName)
        .send({ from: accounts[0] });
      alert(`Teacher ${teacherName} added successfully!`);
      setTeacherName("");
      setTeacherAddress("");
      viewTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Failed to add teacher.");
    }
  };

  const addSubject = async () => {
    if (!subjectName) {
      alert("Please enter the subject name.");
      return;
    }

    try {
      await contract.methods
        .createSubject(subjectName)
        .send({ from: accounts[0] });
      alert(`Subject ${subjectName} added successfully!`);
      setSubjectName("");
      viewSubjects(contract);
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject.");
    }
  };

  const addClass = async () => {
    if (!classDateTime || !subjectId) {
      alert("Please enter both the class date and time and subject ID.");
      return;
    }
  
    try {
      const timestamp = new Date(classDateTime).getTime() / 1000; // Convert date-time to UNIX timestamp
      const subject = await contract.methods.subjectDetails(subjectId).call();
      const subjectName = subject.subjectName;
  
      const formattedDateTime = new Date(classDateTime).toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      });
  
      await contract.methods
        .createClass(timestamp, subjectId)
        .send({ from: accounts[0] });
      alert(`Class for ${subjectName} on ${formattedDateTime} added successfully!`);
      setClassDateTime("");
      setSubjectId("");
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Failed to add class.");
    }
  };  

  const removeStudent = async (address) => {
    try {
      await contract.methods.removeStudent(address).send({ from: accounts[0] });
      alert("Student removed successfully!");
      viewStudents();
    } catch (error) {
      console.error("Error removing student:", error);
      alert("Failed to remove student.");
    }
  };

  const removeTeacher = async (address) => {
    try {
      await contract.methods.removeTeacher(address).send({ from: accounts[0] });
      alert("Teacher removed successfully!");
      viewTeachers();
    } catch (error) {
      console.error("Error removing teacher:", error);
      alert("Failed to remove teacher.");
    }
  };

  const removeSubject = async (id) => {
    try {
      await contract.methods.removeSubject(id).send({ from: accounts[0] });
      alert("Subject removed successfully!");
      viewSubjects();
    } catch (error) {
      console.error("Error removing subject:", error);
      alert("Failed to remove subject.");
    }
  };

  const assignTeacher = async () => {
    if (!assignTeacherSubjectId || !assignTeacherAddress) {
      alert("Please enter both the subject ID and teacher address.");
      return;
    }

    try {
      await contract.methods
        .assignTeacher(assignTeacherSubjectId, assignTeacherAddress)
        .send({ from: accounts[0] });

      const subject = await contract.methods.subjectDetails(assignTeacherSubjectId).call();
      const subjectName = subject.subjectName;

      alert(`Teacher assigned to ${subjectName} successfully!`);

      setAssignTeacherSubjectId("");
      setAssignTeacherAddress("");
    } catch (error) {
      console.error("Error assigning teacher:", error);
      alert("Failed to assign teacher.");
    }
  };

  const enrollStudent = async () => {
    if (!enrollSubjectId || !enrollStudentAddress) {
      alert("Please enter both the subject ID and student address.");
      return;
    }

    try {
      await contract.methods
        .enrollStudent(enrollSubjectId, enrollStudentAddress)
        .send({ from: accounts[0] });

      const subject = await contract.methods.subjectDetails(enrollSubjectId).call();
      const subjectName = subject.subjectName;

      const student = await contract.methods.studentDetails(enrollStudentAddress).call();
      const studentName = student.name;

      alert(`Student ${studentName} successfully enrolled in ${subjectName} subject!`);

      setEnrollSubjectId("");
      setEnrollStudentAddress("");
    } catch (error) {
      console.error("Error enrolling student:", error);
      alert("Failed to enroll student.");
    }
  };

  const searchStudent = async () => {
    if (!searchStudentAddress) {
      alert("Please enter a student address.");
      return;
    }

    try {
      const student = await contract.methods.studentDetails(searchStudentAddress).call();
      if (student && student.studentId !== "0") {
        setSearchedStudent(student);
      } else {
        alert("Student not found.");
        setSearchedStudent(null);
      }
    } catch (error) {
      console.error("Error searching for student:", error);
      alert("Please enter a valid student address.");
    }
  };

  const searchTeacher = async () => {
    if (!searchTeacherAddress) {
      alert("Please enter a teacher address.");
      return;
    }

    try {
      const teacher = await contract.methods.teacherDetails(searchTeacherAddress).call();
      if (teacher && teacher.teacherId !== "0") {
        setSearchedTeacher(teacher);
      } else {
        alert("Teacher not found.");
        setSearchedTeacher(null);
      }
    } catch (error) {
      console.error("Error searching for teacher:", error);
      alert("Please enter a valid teacher address.");
    }
  };

  const searchSubject = async () => {
    if (!searchSubjectId) {
      alert("Please enter a subject ID.");
      return;
    }

    try {
      const subject = await contract.methods.subjectDetails(searchSubjectId).call();
      if (subject && subject.subjectId !== "0") {
        setSearchedSubject(subject);
      } else {
        alert("Subject not found.");
        setSearchedSubject(null);
      }
    } catch (error) {
      console.error("Error searching for subject:", error);
      alert("Please enter a valid subject ID.");
    }
  };

  const viewStudents = async () => {
    try {
      const studentCount = await contract.methods.studentCounter().call();
      const viewedStudents = [];
      for (let i = 1; i <= studentCount; i++) {
        const student = await contract.methods.students(i - 1).call();
        viewedStudents.push(student);
      }
      setStudents(viewedStudents);
    } catch (error) {
      console.error("Error viewing students:", error);
    }
  };

  const viewTeachers = async () => {
    try {
      const teacherCount = await contract.methods.teacherCounter().call();
      const viewedTeachers = [];
      for (let i = 1; i <= teacherCount; i++) {
        const teacher = await contract.methods.teachers(i - 1).call();
        viewedTeachers.push(teacher);
      }
      setTeachers(viewedTeachers);
    } catch (error) {
      console.error("Error viewing teachers:", error);
    }
  };

  const viewSubjects = async () => {
    try {
      const subjectCount = await contract.methods.subjectCounter().call();
      const viewedSubjects = [];
      for (let i = 1; i <= subjectCount; i++) {
        const subject = await contract.methods.subjectDetails(i).call();
        viewedSubjects.push(subject);
      }
      setSubjects(viewedSubjects);
    } catch (error) {
      console.error("Error viewing subjects:", error);
    }
  };

  const viewClasses = async () => {
    try {
      const classCount = await contract.methods.classCounter().call();
      const viewedClasses = [];
      for (let i = 1; i <= classCount; i++) {
        const _class = await contract.methods.classDetails(i).call();
        viewedClasses.push(_class);
      }
      setClasses(viewedClasses);
    } catch (error) {
      console.error("Error viewing classes:", error);
    }
  }

  return (
    <div className="App">
      <h1>Attendance DApp</h1>
      <p>Your account: {accounts[0]}</p>

      <div className="section">
        <h2>Add a New Student</h2>
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
      </div>

      <div className="section">
        <h2>Add a New Teacher</h2>
        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teacher Address"
          value={teacherAddress}
          onChange={(e) => setTeacherAddress(e.target.value)}
        />
        <button onClick={addTeacher}>Add Teacher</button>
      </div>

      <div className="section">
        <h2>Add a New Subject</h2>
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <button onClick={addSubject}>Add Subject</button>
      </div>

      <div className="section">
        <h2>Add a New Class</h2>
        <input
          type="number"
          placeholder="Subject ID"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        />
        <input
          type="datetime-local"
          value={classDateTime}
          onChange={(e) => setClassDateTime(e.target.value)}
        />
        <button onClick={addClass}>Add Class</button>
      </div>

      <div className="section">
        <h2>Assign a Teacher to a Subject</h2>
        <input
          type="text"
          placeholder="Subject ID"
          value={assignTeacherSubjectId}
          onChange={(e) => setAssignTeacherSubjectId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teacher Address"
          value={assignTeacherAddress}
          onChange={(e) => setAssignTeacherAddress(e.target.value)}
        />
        <button onClick={assignTeacher}>Assign Teacher</button>
      </div>

      <div className="section">
        <h2>Enroll a Student in a Subject</h2>
        <input
          type="number"
          placeholder="Subject ID"
          value={enrollSubjectId}
          onChange={(e) => setEnrollSubjectId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Address"
          value={enrollStudentAddress}
          onChange={(e) => setEnrollStudentAddress(e.target.value)}
        />
        <button onClick={enrollStudent}>Enroll Student</button>
      </div>

      <h2>Search</h2>
      <div className="lists-container">
        <div className="search-student">
          <h3>Student</h3>
          <input
            type="text"
            placeholder="Enter Student Address"
            value={searchStudentAddress}
            onChange={(e) => setSearchStudentAddress(e.target.value)}
          />
          <button onClick={searchStudent}>Search Student</button>
          {searchedStudent && (
            <div>
              <h3>Student Details:</h3>
              <p>Student ID: {searchedStudent.studentId}</p>
              <p>Student Name: {searchedStudent.name}</p>
            </div>
          )}
        </div>

        <div className="search-teacher">
          <h3>Teacher</h3>
          <input
            type="text"
            placeholder="Enter Teacher Address"
            value={searchTeacherAddress}
            onChange={(e) => setSearchTeacherAddress(e.target.value)}
          />
          <button onClick={searchTeacher}>Search Teacher</button>
          {searchedTeacher && (
            <div>
              <h3>Teacher Details:</h3>
              <p>Teacher ID: {searchedTeacher.teacherId}</p>
              <p>Teacher Name: {searchedTeacher.name}</p>
            </div>
          )}
        </div>

        <div className="search-subject">
          <h3>Subject</h3>
          <input
            type="number"
            placeholder="Enter Subject ID"
            value={searchSubjectId}
            onChange={(e) => setSearchSubjectId(e.target.value)}
          />
          <button onClick={searchSubject}>Search Subject</button>
          {searchedSubject && (
            <div>
              <h3>Subject Details:</h3>
              <p>Subject ID: {searchedSubject.subjectId}</p>
              <p>Subject Name: {searchedSubject.subjectName}</p>
            </div>
          )}
        </div>
      </div>

      <h2>Lists</h2>
      <div className="lists-container">
        <div className="students-list">
          <h3>Students</h3>
          <button onClick={viewStudents}>View Students</button>
          <ul>
            {students.map((student, index) => (
              <li key={index} className="list-item">
                <span>{`${student.studentId}: ${student.name}`}</span>
                <button onClick={() => removeStudent(student.address)} className="remove-btn">X</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="teachers-list">
          <h3>Teachers</h3>
          <button onClick={viewTeachers}>View Teachers</button>
          <ul>
            {teachers.map((teacher, index) => (
              <li key={index} className="list-item">
                <span>{`${teacher.teacherId}: ${teacher.name}`}</span>
                <button onClick={() => removeTeacher(teacher.address)} className="remove-btn">X</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="subjects-list">
          <h3>Subjects</h3>
          <button onClick={viewSubjects}>View Subjects</button>
          <ul>
            {subjects.map((subject, index) => (
              <li key={index} className="list-item">
                <span>{`${subject.subjectId}: ${subject.subjectName}`}</span>
                <button onClick={() => removeSubject(subject.subjectId)} className="remove-btn">X</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="class-list">
          <h3>Classes</h3>
          <button onClick={viewClasses}>View Classes</button>
          <ul>
            {classes.map((_class, index) => (
              <li key={index} className="list-item">
                <span>{`${_class.classId}: ${_class.subject.subjectName} - ${_class.classPwd}`}</span>
                <button className="inviso"></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
