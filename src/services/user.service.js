import userRepo from '../repositories/user.repository.js';

class UserService {

  async getProfile() {
    return await userRepo.getProfile();
  };


  async me(id) {
    return await userRepo.me(id);
  };
}

export default new UserService();