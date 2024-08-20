import { IAcademicSemester } from '../modules/academicSemester/academicSemester.interface';
import { User } from '../modules/user/user.model';

const findLastRegisteredStudent = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .lean()
    .sort({ createdAt: -1 });

  return lastStudent ? lastStudent.id : undefined;
};

const generateStudentId = async (payload: IAcademicSemester) => {
  let currentStudentId = (0).toString();

  const lastStudent = await findLastRegisteredStudent();

  //2030 01 0001

  const lastStudentAcademicSemesterYear = lastStudent?.substring(0, 4);
  const lastStudentAcademicSemesterCode = lastStudent?.substring(4, 6);

  if (
    lastStudent &&
    lastStudentAcademicSemesterCode === payload.code &&
    lastStudentAcademicSemesterYear === payload.year
  ) {
    currentStudentId = lastStudent?.substring(6);
  }

  let currentId = String(Number(currentStudentId) + 1)
    .toString()
    .padStart(4, '0');

  return (currentId = `${payload.year}${payload.code}${currentId}`);
};

export default generateStudentId;


