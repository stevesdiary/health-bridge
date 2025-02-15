import express, { Router } from "express";

import userRouter from "./modules/user/routes/user.route";
import loginRouter from "./modules/user/routes/login.route";
import hospitalRouter from "./modules/hospital/routes/hospital.route";
import appointmentRouter from "./modules/appointment/routes/appointment.route";
import doctorRouter from "./modules/doctor/routes/doctor.route";
import verifyRouter from "./modules/commonRoute/verify.email";

const router = Router();

router.use("/user", userRouter);
router.use("/log", loginRouter);
router.use('/verify', verifyRouter);
router.use("/hospital", hospitalRouter);
router.use('/appointment', appointmentRouter);
router.use('/doctor', doctorRouter);

export default router;