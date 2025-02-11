import { Router, Request, Response } from 'express';



import hospitalController from "../cotrollers/hospital.cotroller";
import { checkRole } from '../../../middlewares/authorisation';

const hospitalRouter = Router();

hospitalRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy!"})
})

hospitalRouter.post("/register", async (req: Request, res: Response) => {
  await hospitalController.registerHospital(req, res);
});

hospitalRouter.post("/verify", async (req: Request, res: Response) => {
  await hospitalController.verifyHospital(req, res);
})

hospitalRouter.get('/all', checkRole(['user']), async (req: Request, res: Response) => {
  await hospitalController.getHospitals(req, res)
});

// hospitalRouter.get('/one/:id', async (req: Request, res: Response) => {
//   await hospitalController.getOneProvider(req, res);
// });

// hospitalRouter.put('/hospital/:id', async (req: Request, res: Response) => {
//   await hospitalController.updateProvider(req, res);
// })

hospitalRouter.delete('/remove/:id', async (req: Request, res: Response) => {

})

export default hospitalRouter;