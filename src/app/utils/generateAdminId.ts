import { User } from '../modules/user/user.model';

const findLastAdmin = async () => {
  const lastFaculty = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .lean()
    .sort({ createdAt: -1 });

  return lastFaculty ? lastFaculty.id : undefined;
};

export const generateAdminId = async () => {
  let newFacultyId = (0).toString().padStart(4, '0');
  const lastFaculty = await findLastAdmin();

  if (lastFaculty) {
    const match = lastFaculty.match(/A-(\d+)/);
    if (match) {
      const extractedNumber = match[1];

      newFacultyId = (Number(extractedNumber) + 1).toString().padStart(4, '0');
    }

    return `A-${newFacultyId}`;
  } else {
    return `A-${Number(newFacultyId).toString().padStart(3, '0') + 1}`;
  }
};
