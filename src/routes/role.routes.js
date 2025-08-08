import express from 'express'
const router = express.Router();

import * as controller from '../controllers/role.controller.js';


router.post('/role', controller.createRole);

export default router;