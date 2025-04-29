import express, { Router } from "express";

import userRouter from "./modules/user/user.route";
import loginRouter from "./modules/user/login.route";
import hospitalRouter from "./modules/hospital/hospital.route";
import appointmentRouter from "./modules/appointment/appointment.route";
import doctorRouter from "./modules/doctor/doctor.route";
import patientRouter from "./modules/patient/patient.route";
import verifyRouter from "./modules/commonRoute/verify.email";
import paymentRouter from "./modules/payment/payment.route";
import notificationRouter from "./modules/notification/notification.route";

const router = Router();

router.use("/user", userRouter);
router.use("/log", loginRouter);
router.use('/verify', verifyRouter);
router.use("/hospital", hospitalRouter);
router.use('/appointment', appointmentRouter);
router.use('/doctor', doctorRouter);
router.use('/payment', paymentRouter);
router.use('/patient', patientRouter);
router.use('/notification', notificationRouter);


export default router;