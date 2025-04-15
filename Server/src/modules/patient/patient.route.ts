import express, { Request as ExpressRequest, Response} from 'express';
import patientController from './patient.controller';
import authentication from '../../middlewares/authentication';
import { checkRole } from '../../middlewares/authorisation';

const patientRouter = express.Router();

patientRouter.post(
  '/register',
  authentication,
  checkRole(['PATIENT', 'ADMIN']),
  async (req: ExpressRequest, res: Response) => {
    patientController.registerPatient(req, res);
  }
);

patientRouter.get(
  '/all',
  // authentication,
  async (req: ExpressRequest, res: Response) => {
    patientController.getPatients(req, res);
  }
);
// hospitalRouter.post("/register", async (req: ExpressRequest, res: Response) => {
//   await hospitalController.registerHospital(req, res);
// });
// Get single patient by ID
patientRouter.get('/one/:id',
  authentication,
  async (req: ExpressRequest, res: Response) => {
    await patientController.getOnePatient(req, res);
  }
);

// Update patient information
patientRouter.put('/update/:id',
  authentication,
  checkRole(['patient', 'admin']),
  async (req: ExpressRequest, res: Response) => {
    patientController.updatePatient(req, res);
  }
);

// Delete patient
patientRouter.delete(
  '/:id',
  authentication,
  checkRole(['patient', 'admin']),
  async (req: ExpressRequest, res: Response) => {
    patientController.deletePatient(req, res);  
  }
);

export default patientRouter;