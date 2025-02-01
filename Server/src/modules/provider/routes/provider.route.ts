import { Router, Request, Response } from 'express';



import providerController from "..//cotrollers/provider.cotroller";
import { checkRole } from '../../../middlewares/authorisation';

const providerRouter = Router();

providerRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy!"})
})

providerRouter.post("/register", async (req: Request, res: Response) => {
  await providerController.register(req, res);
});

providerRouter.get('/all', checkRole(['user']), async (req: Request, res: Response) => {
  await providerController.getProviders(req, res)
});

providerRouter.get('/one/:id', async (req: Request, res: Response) => {
  await providerController.getOneProvider(req, res);
});

providerRouter.put('/provider/:id', async (req: Request, res: Response) => {
  await providerController.updateProvider(req, res);
})

providerRouter.delete('/remove/:id', async (req: Request, res: Response) => {

})

export default providerRouter;