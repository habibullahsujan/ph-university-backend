import { User } from '../modules/user/user.model';

const findLastFaculty = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .lean()
    .sort({ createdAt: -1 });

  return lastFaculty ? lastFaculty.id : undefined;
};

export const generateFacultyId = async () => {
  let newFacultyId = (0).toString().padStart(4, '0');
  const lastFaculty = await findLastFaculty();

  if (lastFaculty) {
    const match = lastFaculty.match(/F-(\d+)/);
    if (match) {
      const extractedNumber = match[1];

      newFacultyId = (Number(extractedNumber) + 1).toString().padStart(4,'0');
    }

    return `F-${newFacultyId}`;
  } else {
    return `F-${Number(newFacultyId).toString().padStart(3, '0') + 1}`;
  }
};
