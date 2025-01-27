const Attendance = artifacts.require("Attendance");
const { assert } = require("chai");

contract("Attendance", (accounts) => {
    let attendanceInstance;
    const admin = accounts[0];
    const student1 = accounts[1];
    const teacher1 = accounts[2];

    before(async () => {
        attendanceInstance = await Attendance.new({ from: admin });
    });

    it("should deploy the contract and set the admin", async () => {
        const contractAdmin = await attendanceInstance.admin();
        assert.equal(contractAdmin, admin, "Admin is not set correctly");
    });

    it("should add a student", async () => {
        await attendanceInstance.addStudent("Alice", student1, { from: admin });
        const studentCount = await attendanceInstance.studentCounter();
        assert.equal(studentCount.toNumber(), 1, "Student count should be 1");
    });

    it("should add a teacher", async () => {
        await attendanceInstance.addTeacher("Bob", teacher1, { from: admin });
        const teacherCount = await attendanceInstance.teacherCounter();
        assert.equal(teacherCount.toNumber(), 1, "Teacher count should be 1");
    });

    it("should create a subject", async () => {
        await attendanceInstance.createSubject("Blockchain", teacher1, { from: admin });
        const subjectCount = await attendanceInstance.subjectCounter();
        assert.equal(subjectCount.toNumber(), 1, "Subject count should be 1");
    });

    it("should enroll a student in a subject", async () => {
        await attendanceInstance.enrollStudent(1, student1, { from: admin });
        const subject = await attendanceInstance.subjects(1);
        assert.equal(subject.enrolledStudents.length, 1, "Student should be enrolled");
    });

    it("should create a class for a subject", async () => {
        await attendanceInstance.createClass(1, 1710000000, "class123", { from: admin });
        const classCount = await attendanceInstance.classCounter();
        assert.equal(classCount.toNumber(), 1, "Class count should be 1");
    });

    it("should allow a student to mark attendance using the correct password", async () => {
        await attendanceInstance.markAttendance(1, "class123", { from: student1 });
        const isPresent = await attendanceInstance.checkAttendance(1, student1);
        assert.isTrue(isPresent, "Attendance should be marked");
    });
});
