const userRepo = require('../repositories/user.repository');

exports.getProfile = async () => {
    return await userRepo.getProfile();
};

exports.me = async (id) => {
  return await  userRepo.me(id);
};
