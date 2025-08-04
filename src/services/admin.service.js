const adminRepo = require('../repositories/admin.repository');

exports.updateRole = async () => {
  return await userRepo.getPupdateRolerofile();
};


exports.createRole = async (name) => {
  // Optional: validate role name, check for duplicates, etc.
  return await adminRepo.createRole(name);
};

exports.createPermission = async (data) => {
  // Optional: validate role existence, check duplicates, etc.
  return await adminRepo.createPermission(data);
};