import { customAlphabet } from "nanoid";
import { Op } from "sequelize";

import { getFromRedis, saveToRedis } from "../../core/redis";
import { Doctor } from "./doctor.model";
import sendEmail from "../services/email.service";
import { DoctorRegistrationDTO } from '../types/type';
import { Hospital } from "../hospital/hospital.model";
import { error } from "console";

export const registerDoctor = async (validatedDoctorInfo: DoctorRegistrationDTO) => {
  try {
    const doctorExists = await Doctor.findOne({
      where: { email: validatedDoctorInfo.email },
    })

    if (doctorExists) {
      return {
        statusCode: 400,
        status: 'fail',
        message: 'Doctor profile already exists, verify email if not and cotinue',
        data: null
      }
    }
    const hospital = await Hospital.findOne({ 
      where: { email: validatedDoctorInfo.hospital_email },
      attributes: ['id']
    });
    if (!hospital) {
      throw error('Hospital record not found')
    }
    
    let hospital_id = hospital?.id;
    // console.log("HOSPITAL ID", hospital_id);

    if (hospital_id) {
      let doctorRegistrationData = {
        first_name: validatedDoctorInfo.first_name,
        last_name: validatedDoctorInfo.last_name,
        email: validatedDoctorInfo.email,
        specialty: validatedDoctorInfo.specialty,
        phone: validatedDoctorInfo.phone,
        hospital_id: hospital_id 
      }
      const doctor = await Doctor.create(doctorRegistrationData);
      if (doctor) {
        const nanoid = customAlphabet("1234567890", 6)();
          const verificationCode = nanoid;
          await saveToRedis(`verifydoctor:${doctor.email}`, verificationCode, 600);
          const emailPayload = {
            to: doctor.email as string,
            subject: "Email Verification",
            text: `Your verification code is: ${verificationCode}`,
          };
          await sendEmail(emailPayload);
      }
      return {
        statusCode: 201,
        status: "success",
        message: `Doctor ${doctor.first_name} is now registered`,
        data: doctorRegistrationData,
      };
    }    
  } catch (error) {
    console.log('An error occured', error);
    throw error;
  }
}

export const verifyDoctor = async ({email, code}: {email: string, code: string}) => {
  try {
    const verificationCode = await getFromRedis(`verifydoctor:${email}`);
    if (verificationCode === code) {
      await Doctor.update(
        { verified: true },
        { where: { email } },
      );
      return {
        statusCode: 200,
        status: "success",
        message: "Doctor verified",
        data: null
      };
    }
    const verifiedDoctor = await Doctor.findOne(
      { where: {
        [Op.and]:[
          { email: email },
          { verified: true }
        ],
      } }
    );
    if (verifiedDoctor) {
      return {
        statusCode: 200,
        status: "success",
        message: "Doctor already verified",
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

export const findDoctors = async ()=> {
  try {
    const doctors = await Doctor.findAll();
    if (!doctors) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'No doctor record found',
        data: null
      }
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Doctord found',
      data: doctors
    }

  } catch (error) {
    throw error;
  }
}

export const findOneDoctor = async (id: string ) => {
  try {
    const doctors = await Doctor.findAll();
    if (!doctors) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'No doctor record found',
        data: null
      }
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Doctord found',
      data: doctors
    }

  } catch (error) {
    throw error;
  }
}

export const updateDoctor = async (id: string, validatedDoctorInfo: DoctorRegistrationDTO )=> {
  try {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'No doctor record found',
        data: null
      }
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Doctord record updated',
      data: doctor
    }

  } catch (error) {
    throw error;
  }
}