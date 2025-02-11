import { Router, Request as ExpressRequest, Response } from 'express';



import hospitalController from "../cotrollers/hospital.cotroller";
import { checkRole } from '../../../middlewares/authorisation';

const hospitalRouter = Router();

hospitalRouter.get('/health', (req: ExpressRequest, res: Response) => {
  res.status(200).json({ message: "Healthy!"})
})

hospitalRouter.post("/register", async (req: ExpressRequest, res: Response) => {
  await hospitalController.registerHospital(req, res);
});

hospitalRouter.post("/verify", async (req: ExpressRequest, res: Response) => {
  await hospitalController.verifyHospital(req, res);
})

hospitalRouter.get('/all', async (req: ExpressRequest, res: Response) => {
  await hospitalController.getHospitals(req, res)
});

hospitalRouter.get('/one/:id', async (req: ExpressRequest, res: Response) => {
  await hospitalController.getOneHospital(req, res);
});

hospitalRouter.put('/hospital/:id', async (req: ExpressRequest, res: Response) => {
  await hospitalController.updateHospital(req, res);
})

hospitalRouter.delete('/remove/:id', async (req: ExpressRequest, res: Response) => {
  await hospitalController.deleteHospital(req, res);
})

export default hospitalRouter;