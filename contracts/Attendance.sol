//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Attendance {

    address public admin;
    Student[] public students;
    Teacher[] public teachers;
    uint256 public classCounter;
    uint256 public subjectCounter;
    uint256 public studentCounter;
    uint256 public teacherCounter;

    struct Student {
        uint256 studentId;
        string name;
    }

    struct Teacher {
        uint256 teacherId;
        string name;
    }

    struct Subject {
        uint256 subjectId;
        string subjectName;
        Teacher[] teachingTeachers;
        Student[] enrolledStudents;
        uint256[] classIds;
    }

    struct Class {
        Subject subject;
        uint256 classId;
        uint256 classDate;
        uint256 classPwd;
        mapping(address => bool) attendance;
    }

    event studentAdded(address student, string name);
    event teacherAdded(address teacher, string name);
    event subjectCreated(uint256 subjectId, string subjectName);
    event classCreated(uint256 classId, uint256 classDate, uint256 subjectId);
    event studentEnrolled(uint256 subjectId, address student);
    event teacherAssigned(uint256 subjectId, address teacher);
    event attendanceMarked(uint256 classId, address student);


    mapping(address => Student) public studentDetails;
    mapping(address => Teacher) public teacherDetails;
    mapping(uint256 => Subject) public subjectDetails;
    mapping(uint256 => Class) public classDetails;

    mapping(address => string) public roles;

    constructor() {
        admin = msg.sender;
        roles[msg.sender] = "admin"; // Contract deployer is the admin
    }

    modifier onlyAdmin() {
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("admin")), "Only admin can call this function");
        _;
    }

    modifier onlyTeacher() {
        require(teacherDetails[msg.sender].teacherId != 0, "Only teachers can call this function");
        _;
    }

    modifier onlyStudent() {
        require(studentDetails[msg.sender].studentId != 0, "Only students can call this function");
        _;
    }

    modifier onlyEnrolledStudent(uint256 classId) {
        bool isEnrolled = false;
        for (uint256 i = 0; i < subjectDetails[classDetails[classId].subject.subjectId].enrolledStudents.length; i++) {
            if (subjectDetails[classDetails[classId].subject.subjectId].enrolledStudents[i].studentId == studentDetails[msg.sender].studentId) {
                isEnrolled = true;
                break;
            }
        }
        require(isEnrolled, "Only enrolled students can call this function");
        _;
    }

    function assignRole(address user, string memory role) internal onlyAdmin {
        roles[user] = role;
    }

    function getRole(address user) public view returns (string memory) {
        return roles[user];
    }

    function addStudent(address _student, string memory _name) public onlyAdmin {
        studentCounter++;
        studentDetails[_student] = Student(studentCounter, _name);
        students.push(Student(studentCounter, _name));
        assignRole(_student, "student");

        emit studentAdded(_student, _name);
    }   

    function addTeacher(address _teacher, string memory _name) public onlyAdmin {
        teacherCounter++;
        teacherDetails[_teacher] = Teacher(teacherCounter,_name);
        teachers.push(Teacher(teacherCounter, _name));
        assignRole(_teacher, "teacher");

        emit teacherAdded(_teacher, _name);
    }

    function createSubject(string memory _subjectName) public onlyAdmin {
        subjectCounter++;
        Subject storage newSubject = subjectDetails[subjectCounter];
        newSubject.subjectId=subjectCounter;
        newSubject.subjectName = _subjectName;

        emit subjectCreated(subjectCounter, _subjectName);
    }

    function createClass(uint256 _classDate, uint256 _subjectId) public onlyAdmin {
        classCounter++;
        
        Class storage newClass = classDetails[classCounter];
        newClass.subject = subjectDetails[_subjectId];
        newClass.classId = classCounter;
        newClass.classDate = _classDate;
        subjectDetails[_subjectId].classIds.push(classCounter);

        emit classCreated(classCounter, _classDate, _subjectId);
    }

    function getClassIds(uint256 _subjectId) public view returns (uint256[] memory) {
        return subjectDetails[_subjectId].classIds;
    }

    function enrollStudent(uint256 _subjectId, address _student) public onlyAdmin {
        subjectDetails[_subjectId].enrolledStudents.push(studentDetails[_student]);

        emit studentEnrolled(_subjectId, _student);
    }

    function assignTeacher(uint256 _subjectId, address _teacher) public onlyAdmin {
        subjectDetails[_subjectId].teachingTeachers.push(teacherDetails[_teacher]);

        emit teacherAssigned(_subjectId, _teacher);
    }

    function markAttendance(uint256 _classId, uint256 _pwd) public onlyEnrolledStudent(classDetails[_classId].classId) {
        require(classDetails[_classId].attendance[msg.sender] == false, "Attendance already marked");
        require(classDetails[_classId].classPwd == _pwd, "Invalid password");
        classDetails[_classId].attendance[msg.sender] = true;

        emit attendanceMarked(_classId, msg.sender);
    }

    function checkAttendance(uint256 _classId) public view returns (bool) {
        return classDetails[_classId].attendance[msg.sender];
    }

    function checkAttendance(uint256 _classId, address _student) public view onlyTeacher returns (bool) {
        return classDetails[_classId].attendance[_student];
    }

    function generateClassPwd(uint256 _classId, uint256 _seed) public onlyTeacher {
        classDetails[_classId].classPwd = getRandomNumber(_seed);
    }

    function getRandomNumber(uint256 seed) public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.timestamp, msg.sender, seed)));
    }

    function removeStudent(address _student) public onlyAdmin {
        delete studentDetails[_student];
    }

    function removeTeacher(address _teacher) public onlyAdmin {
        delete teacherDetails[_teacher];
    }

    function removeSubject(uint256 _subjectId) public onlyAdmin {
        delete subjectDetails[_subjectId];
    }

    function removeClass(uint256 _classId) public onlyAdmin {
        delete classDetails[_classId];
    }

}