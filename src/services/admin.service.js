import adminRepo from '../repositories/admin.repository.js';
import userRepo from '../repositories/user.repository.js'; // You forgot to import this

export const updateRole = async () => {
  return await userRepo.getPupdateRolerofile(); // ⛔ Typo here — likely wrong method name
};

export const createRole = async (name) => {
  // Optional: validate role name, check for duplicates, etc.
  return await adminRepo.createRole(name);
};

export const createPermission = async (data) => {
  // Optional: validate role existence, check duplicates, etc.
  return await adminRepo.createPermission(data);
};
