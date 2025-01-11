const Attendance = artifacts.require("Attendance");
const truffleAssert = require("truffle-assertions");

contract("Attendance", (accounts) => {
    const [owner, teacher, student, otherAccount] = accounts;

    beforeEach(async () => {
        this.attendance = await Attendance.new({ from: owner });
    });

    it("should set the contract owner correctly", async () => {
        const contractOwner = await this.attendance.owner();
        assert.equal(contractOwner, owner, "Owner is not set correctly");
    });

    it("should allow the owner to add a student", async () => {
        await this.attendance.addStudent(student, "John Doe", { from: owner });
        const studentDetails = await this.attendance.studentDetails(student);
        assert.equal(studentDetails.name, "John Doe", "Student name is incorrect");
        assert.equal(studentDetails.studentId.toNumber(), 1, "Student ID is incorrect");
    });

    it("should allow the owner to add a teacher", async () => {
        await this.attendance.addTeacher(teacher, "Dr. Smith", { from: owner });
        const teacherDetails = await this.attendance.teacherDetails(teacher);
        assert.equal(teacherDetails.name, "Dr. Smith", "Teacher name is incorrect");
        assert.equal(teacherDetails.teacherId.toNumber(), 1, "Teacher ID is incorrect");
    });

    it("should allow the owner to create a subject", async () => {
        await this.attendance.createSubject("Mathematics", { from: owner });
        const subject = await this.attendance.subjectDetails(1);
        assert.equal(subject.subjectName, "Mathematics", "Subject name is incorrect");
    });

    it("should allow the owner to create a class", async () => {
        await this.attendance.createSubject("Mathematics", { from: owner });
        await this.attendance.createClass(1672531200, 1, { from: owner }); // Timestamp example
        const classDetails = await this.attendance.classDetails(1);
        assert.equal(classDetails.classId.toNumber(), 1, "Class ID is incorrect");
        assert.equal(classDetails.classDate.toNumber(), 1672531200, "Class date is incorrect");
    });

    it("should allow the owner to enroll a student in a subject", async () => {
        await this.attendance.createSubject("Mathematics", { from: owner });
        await this.attendance.addStudent(student, "John Doe", { from: owner });
    
        // Call enrollStudent and listen for the event
        const result = await this.attendance.enrollStudent(1, student, { from: owner });
    
        // Verify the event was emitted
        truffleAssert.eventEmitted(result, "StudentEnrolled", (ev) => {
            return ev.subjectId.toNumber() === 1 && ev.student === student;
        });
    
        // Optional: Further validate that the student was added correctly
        const subject = await this.attendance.subjectDetails(1);
        const enrolledStudent = await this.attendance.studentDetails(student);
        assert.equal(enrolledStudent.name, "John Doe", "Enrolled student name is incorrect");
    });    

    it("should allow a student to mark attendance", async () => {
        await this.attendance.createSubject("Mathematics", { from: owner });
        await this.attendance.createClass(1672531200, 1, { from: owner });
        await this.attendance.addStudent(student, "John Doe", { from: owner });
        await this.attendance.enrollStudent(1, student, { from: owner });

        await this.attendance.markAttendance(1, { from: student });
        const isPresent = await this.attendance.checkAttendance(1, { from: student });
        assert.isTrue(isPresent, "Attendance was not marked correctly");
    });

    it("should allow a teacher to check attendance for a student", async () => {
        await this.attendance.createSubject("Mathematics", { from: owner });
        await this.attendance.createClass(1672531200, 1, { from: owner });
        await this.attendance.addStudent(student, "John Doe", { from: owner });
        await this.attendance.addTeacher(teacher, "Dr. Smith", { from: owner });
        await this.attendance.enrollStudent(1, student, { from: owner });
        await this.attendance.assignTeacher(1, teacher, { from: owner });

        await this.attendance.markAttendance(1, { from: student });
        const isPresent = await this.attendance.checkAttendance(1, student, { from: teacher });
        assert.isTrue(isPresent, "Teacher could not check attendance correctly");
    });

    it("should not allow a non-student to mark attendance", async () => {
        await this.attendance.createSubject("Mathematics", { from: owner });
        await this.attendance.createClass(1672531200, 1, { from: owner });
        try {
            await this.attendance.markAttendance(1, { from: otherAccount });
            assert.fail("Non-student was able to mark attendance");
        } catch (error) {
            assert.include(error.message, "Only enrolled students can call this function");
        }
    });
});
