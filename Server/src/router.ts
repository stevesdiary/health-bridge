import express, { Router } from "express";

import userRouter from "./modules/user/routes/registration.route";
import loginRouter from "./modules/user/routes/login.route";
import providerRouter from "./modules/provider/routes/provider.route";

const router = Router();

router.use("/user", userRouter);
router.use("/log", loginRouter);
router.use("/provider", providerRouter);

export default router;