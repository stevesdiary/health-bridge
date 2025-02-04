import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";

import { getFromRedis, saveToRedis } from "../../../core/redis";
import { CreationAttributes } from "sequelize";
import { User } from "../models/user.model";
import sendEmail from "./email.service";
import { VerificationResponse, VerifyRequest } from "../../types/type";

const salt = process.env.BCRYPT_SALT || 10;

export const registerUser = async (userData: CreationAttributes<User>) => {
  try {
    const emailExists = await User.findOne({
      where: {
        email: userData.email,
      },
    });
    // console.log('It got here service!');
    if (emailExists) {
      return {
        statusCode: 400,
        status: 'fail',
        message: `User already exists, login with this email and password`,
        data: null
      };
    }
    const hashed = await bcrypt.hash(userData.password, salt);
    let userCreationData = {
      name: userData.name,
      email: userData.email,
      password: hashed,
    };

    const { password: _, ...userRegistrationData } = userCreationData;
    const user = await User.create(userCreationData);
    if (user) {
      const nanoid = customAlphabet("1234567890", 6)();
      const verificationCode = nanoid;
      await saveToRedis(`"verify" + ${user.email}`, verificationCode, 600);
      const emailPayload = {
        to: user.email,
        subject: "Email Verification",
        text: `Your verification code is ${verificationCode}`,
      };
      await sendEmail(emailPayload);
    }

    return {
      statusCode: 201,
      status: "success",
      message: "User registered",
      data: [userRegistrationData],
    };
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (req: VerifyRequest) => {
  try {
    const { email, code } = req.body;
    const verificationCode = await getFromRedis(`"verify" + ${email}`);
    console.log('Got vv from redis', verificationCode, code)
    if (verificationCode === code) {
      await User.update(
        { verified: true },
        { where: { email } },
      );
      console.log("User verification service", email, code);
      return {
        statusCode: 200,
        status: "success",
        message: "User verified",
        data: null
      };
    }
    return {
      statusCode: 400,
      status: "fail",
      message: "Invalid verification code",
      data: null
    };
  } catch (error) {
    throw error;
  }
};

