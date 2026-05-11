import express from 'express';
import { login, getCompanies, saveGeoConnection, register, toggleVip } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/companies', getCompanies);
router.post('/companies/geo', saveGeoConnection);
router.post('/companies/toggle-vip', toggleVip);

export default router;
