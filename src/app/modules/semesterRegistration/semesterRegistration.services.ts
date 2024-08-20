/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { ISemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../query/QueryBuilder';
import { SemesterRegistrationStatus } from './semesterRegistration.constants';

const createSemesterRegistrationIntoDB = async (
  payload: ISemesterRegistration,
) => {
  const isAnySemesterUpcomingOrOngoing = await SemesterRegistration.findOne({
    $or: [{ status: SemesterRegistrationStatus.UPCOMING }, { status: SemesterRegistrationStatus.ONGOING }],
  });
  if (isAnySemesterUpcomingOrOngoing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isAnySemesterUpcomingOrOngoing.status} registered semester!`,
    );
  }
  //check the semester is registered before
  const semesterAlreadyRegistered = await SemesterRegistration.findOne({
    academicSemester: payload.academicSemester,
  });

  if (semesterAlreadyRegistered) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Semester is already registered',
    );
  }

  //check the semester is exist or not
  const semesterExist = await AcademicSemester.findById(
    payload.academicSemester,
  );
  if (!semesterExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Semester is not exist');
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllRegisteredSemesters = async (query: Record<string, any>) => {
  const result = SemesterRegistration.find({});
  return result;
};

const getSingleRegisteredSemester = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateRegisteredSemester = async (
  id: string,
  payload: Partial<ISemesterRegistration>,
) => {
  //check the semester is exist or not
  const semesterExist = await SemesterRegistration.findById(id);
  if (!semesterExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Semester is not exist');
  }
  //check the requested semester status is ended
  const requestedSemester = semesterExist?.status;
  if (requestedSemester === SemesterRegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't update an ended semester",
    );
  }
  //check the update flow upcoming =>ongoing =>ended
  if (requestedSemester === SemesterRegistrationStatus.UPCOMING && payload.status === SemesterRegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't directly change the semester from  upcoming to ended.",
    );
  }
  if (requestedSemester === SemesterRegistrationStatus.ONGOING && payload.status === SemesterRegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't directly change the semester from  ongoing to upcoming.",
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllRegisteredSemesters,
  getSingleRegisteredSemester,
  updateRegisteredSemester,
};
