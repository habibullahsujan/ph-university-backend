import { TDays } from './offeredCourse.interface';

type TSchedules = {
  days: TDays[] | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
};
export const isTimeConflict = (
  assignedSchedules: TSchedules[],
  newSchedule: TSchedules,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    if (newEndTime < existingEndTime && newStartTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
