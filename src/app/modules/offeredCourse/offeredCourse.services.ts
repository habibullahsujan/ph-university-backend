import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { IOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { isTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: Partial<IOfferedCourse>) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Semester Registration is not exist',
    );
  }
  const academicSemester = isSemesterRegistrationExists?.academicSemester;

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Academic faculty is not exist');
  }
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Academic department is not exist',
    );
  }
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course is not exist');
  }
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Faculty is not exist');
  }

  const isDepartmentIsBelongToAcademicFaculty =
    await AcademicDepartment.findOne({
      academicFaculty,
      _id: academicDepartment,
    });
  if (!isDepartmentIsBelongToAcademicFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Department is not belong to this faculty.',
    );
  }
  const isSameSectionIsExistsOnSameRegisteredSemester =
    await OfferedCourse.findOne({ semesterRegistration, course, section });
  if (isSameSectionIsExistsOnSameRegisteredSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Offered Course with same section is already exists.',
    );
  }

  //get all schedules for he faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // assignedSchedules.forEach((schedule) => {
  //   const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
  //   const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
  //   const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
  //   const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
  //   if (newEndTime < existingEndTime && newStartTime > existingStartTime) {
  //     throw new AppError(
  //       httpStatus.BAD_REQUEST,
  //       'This faculty is not available for this time.',
  //     );
  //   }
  // });

  if (isTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This faculty is not available for this time.',
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<IOfferedCourse>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  //check the offeredCourse is exist or not
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course is not exist');
  }
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Faculty is not exist');
  }

  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;

  const checkSemesterRegistrationStatus=await SemesterRegistration.findById(semesterRegistration);
  if(checkSemesterRegistrationStatus?.status !== 'UPCOMING'){
    throw new AppError(httpStatus.FORBIDDEN, 'This semester registration is not upcoming. You can only change the Ongoing semester registration status');
  }
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (isTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This faculty is not available for this time.',
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload);
  return result;
};
export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
};
