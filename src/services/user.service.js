import * as userRepo from '../repositories/user.repository.js';

export const getProfile = async () => {
  return await userRepo.getProfile();
};

export const me = async (id) => {
  return await userRepo.me(id);
};
