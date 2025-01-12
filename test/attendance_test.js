const Attendance = artifacts.require("Attendance");

contract("Attendance", (accounts) => {
    let attendanceInstance;

    before(async () => {
        attendanceInstance = await Attendance.deployed();
    });

    it("should add a new student", async () => {
        const studentAddress = accounts[1];
        const studentName = "John Doe";
        await attendanceInstance.addStudent(studentAddress, studentName, { from: accounts[0] });

        const student = await attendanceInstance.studentDetails(studentAddress);
        assert.equal(student.name, studentName, "Student name is incorrect");
        assert.equal(student.studentId.toNumber(), 1, "Student ID is incorrect");
    });

    it("should add a new teacher", async () => {
        const teacherAddress = accounts[2];
        const teacherName = "Jane Smith";
        await attendanceInstance.addTeacher(teacherAddress, teacherName, { from: accounts[0] });

        const teacher = await attendanceInstance.teacherDetails(teacherAddress);
        assert.equal(teacher.name, teacherName, "Teacher name is incorrect");
        assert.equal(teacher.teacherId.toNumber(), 1, "Teacher ID is incorrect");
    });

    it("should create a new subject", async () => {
        const subjectName = "Blockchain 101";
        await attendanceInstance.createSubject(subjectName, { from: accounts[0] });

        const subject = await attendanceInstance.subjectDetails(1);
        assert.equal(subject.subjectName, subjectName, "Subject name is incorrect");
        assert.equal(subject.subjectId.toNumber(), 1, "Subject ID is incorrect");
    });

    it("should enroll a student in a subject", async () => {
        const subjectId = 1;
        const studentAddress = accounts[1];
        await attendanceInstance.enrollStudent(subjectId, studentAddress, { from: accounts[0] });
    
        const enrolledStudentIds = await attendanceInstance.getEnrolledStudents(subjectId);
        assert.equal(enrolledStudentIds.length, 1, "No students enrolled in the subject");
        assert.equal(enrolledStudentIds[0].toNumber(), 1, "Enrolled student ID is incorrect");
    });
    
    it("should assign a teacher to a subject", async () => {
        const subjectId = 1;
        const teacherAddress = accounts[2];
        await attendanceInstance.assignTeacher(subjectId, teacherAddress, { from: accounts[0] });
    
        const teachingTeacherIds = await attendanceInstance.getTeachingTeachers(subjectId);
        assert.equal(teachingTeacherIds.length, 1, "No teachers assigned to the subject");
        assert.equal(teachingTeacherIds[0].toNumber(), 1, "Assigned teacher ID is incorrect");
    });    

    it("should create a new class", async () => {
        const classDate = Math.floor(Date.now() / 1000); // Current timestamp
        const subjectId = 1;
        await attendanceInstance.createClass(classDate, subjectId, { from: accounts[0] });

        const createdClass = await attendanceInstance.classDetails(1);
        assert.equal(createdClass.classId.toNumber(), 1, "Class ID is incorrect");
        assert.equal(createdClass.classDate.toNumber(), classDate, "Class date is incorrect");
    });

    it("should allow a student to mark attendance", async () => {
        const classId = 1;
        await attendanceInstance.markAttendance(classId, { from: accounts[1] });

        const attendanceMarked = await attendanceInstance.checkAttendance(classId, { from: accounts[1] });
        assert.equal(attendanceMarked, true, "Attendance was not marked correctly");
    });

    it("should allow a teacher to check a student's attendance", async () => {
        const classId = 1;
        const studentAddress = accounts[1];
        const attendanceChecked = await attendanceInstance.checkAttendance(classId, studentAddress, { from: accounts[2] });
        assert.equal(attendanceChecked, true, "Teacher could not verify attendance correctly");
    });

    it("should prevent non-enrolled students from marking attendance", async () => {
        const classId = 1;
        try {
            await attendanceInstance.markAttendance(classId, { from: accounts[3] });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(
                error.message.includes("Only enrolled students can call this function"),
                `Expected 'Only enrolled students can call this function' but got ${error.message}`
            );
        }
    });
});
