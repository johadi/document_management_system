require('dotenv').config();

const data = {
  adminRole: {
    title: 'Admin'
  },
  regularRole: {
    title: 'Regular'
  },
  adminUser: {
    roleId: 1,
    username: process.env.ADMIN_USERNAME,
    firstname: process.env.ADMIN_FIRSTNAME,
    lastname: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
};
export default data;
