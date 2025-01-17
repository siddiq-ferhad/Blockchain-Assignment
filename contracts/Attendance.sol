//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Attendance {

    address public owner;
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

    mapping(address => Student) public studentDetails;
    mapping(address => Teacher) public teacherDetails;
    mapping(uint256 => Subject) public subjectDetails;
    mapping(uint256 => Class) public classDetails;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
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
    
    function addStudent(address _student, string memory _name) public onlyOwner {
        studentCounter++;
        studentDetails[_student] = Student(studentCounter, _name);
        students.push(Student(studentCounter, _name));
    }   

    function addTeacher(address _teacher, string memory _name) public onlyOwner {
        teacherCounter++;
        teacherDetails[_teacher] = Teacher(teacherCounter,_name);
        teachers.push(Teacher(teacherCounter, _name));
    }

    function createSubject(string memory _subjectName) public onlyOwner {
        subjectCounter++;
        Subject storage newSubject = subjectDetails[subjectCounter];
        newSubject.subjectId=subjectCounter;
        newSubject.subjectName = _subjectName;
    }

    function createClass(uint256 _classDate, uint256 _subjectId) public onlyOwner {
        classCounter++;
        
        Class storage newClass = classDetails[classCounter];
        newClass.subject = subjectDetails[_subjectId];
        newClass.classId = classCounter;
        newClass.classDate = _classDate;
        subjectDetails[_subjectId].classIds.push(classCounter);
    }

    function enrollStudent(uint256 _subjectId, address _student) public onlyOwner {
        subjectDetails[_subjectId].enrolledStudents.push(studentDetails[_student]);
    }

    function assignTeacher(uint256 _subjectId, address _teacher) public onlyOwner {
        subjectDetails[_subjectId].teachingTeachers.push(teacherDetails[_teacher]);
    }

    function markAttendance(uint256 _classId, uint256 _pwd) public onlyEnrolledStudent(classDetails[_classId].classId) {
        require(classDetails[_classId].attendance[msg.sender] == false, "Attendance already marked");
        require(classDetails[_classId].classPwd == _pwd, "Invalid password");
        classDetails[_classId].attendance[msg.sender] = true;
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
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, seed)));
    }

    constructor() {
        owner = msg.sender;
    }

}