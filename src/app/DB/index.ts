import config from '../config';
import { USER_ROLES } from '../modules/user/user.const';
import { User } from '../modules/user/user.model';

const superAdmin = {
  id: '0001',
  email: 'habibsujan008@gmail.com',
  password: config.suer_admin_password,
  role: USER_ROLES.superAdmin,
  status: 'in-progress',
  needsPasswordChange: false,
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({
    role: USER_ROLES.superAdmin,
  });
  if (!isSuperAdminExists) {
    await User.create(superAdmin);
  }
};


export default seedSuperAdmin