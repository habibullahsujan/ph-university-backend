/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { Student } from '../student/student.model';
import { EnrolledCourse } from './enrolledCourse.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Faculty } from '../faculty/faculty.model';
import { generateCourseMarkAndGrade } from './enrolledCourse.utils';

const createEnrolledCourse = async (userId: string, payload: string) => {
  // implement logic to create enrolled course in the database

  //check the offered course is exists or not
  const offeredCourse = await OfferedCourse.findById(payload);
  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }
  if (offeredCourse.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Offered course is full');
  }

  const course = await Course.findById(offeredCourse.course);
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  //check the student want to create offered course this student is already enrolled in this course
  const isEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: offeredCourse.semesterRegistration,
    offeredCourse: payload,
    student: student?._id,
  });
  if (isEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Offered course not found');
  }

  //check the credit is eceeded
  const semesterRegistration = await SemesterRegistration.findById(
    offeredCourse.semesterRegistration,
  ).select('maxCredit');

  //total enrolled credits + new enrolled course credit > max credit
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: offeredCourse.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourses',
      },
    },
    {
      $unwind: '$enrolledCourses',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourses.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  if (
    totalCredits &&
    semesterRegistration?.maxCredit &&
    totalCredits + course?.credits > semesterRegistration?.maxCredit
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Credit exceeded');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: offeredCourse.semesterRegistration,
          academicSemester: offeredCourse.academicDepartment,
          academicFaculty: offeredCourse.academicFaculty,
          academicDepartment: offeredCourse.academicDepartment,
          offeredCourse: offeredCourse._id,
          course: offeredCourse.course,
          student: student?._id,
          faculty: offeredCourse.faculty,
          isEnrolled: true,
          courseMarks: {},
        },
      ],
      { session },
    );

    const maxCapacity = offeredCourse.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(payload, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create enrolled course',
    ); // Ensure the error is rethrown so it can be handled by the caller
  }
};

const updateEnrolledCourseMarks = async (
  userId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  // implement logic to update enrolled course marks in the database

  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(
    payload.offeredCourse,
  );

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }

  const isSemesterExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const faculty = await Faculty.findOne({ id: userId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is not authorized to perform this operation',
    );
  }
  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is not authorized to perform this operation',
    );
  }

  const modifiedData: Record<string, any> = { ...courseMarks };

  if (isCourseBelongToFaculty.courseMarks.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;
    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = generateCourseMarkAndGrade(totalMarks);
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks[${key}]`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};
export const enrolledCourseServices = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
