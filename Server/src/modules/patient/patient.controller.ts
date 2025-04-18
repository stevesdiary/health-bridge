import { Request as ExpressRequest, Response } from 'express';
import * as yup from 'yup';

import { createPatient, getPatients, getOnePatient, updatePatient, deletePatient } from '../patient/patient.services';
import { patientSchema, searchSchema, patientUpdateSchema, idSchema } from '../../utils/validator';
import { PatientResponseData } from '../types/type';

const patientController = {
  registerPatient: async (req: ExpressRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
      }
      // console.log(user.id)

      const clientData = await patientSchema.validate(req.body, {
        abortEarly: false
      });

      const userId = user.id;
      const validatedData = {
        // user_id: userId,
        user_id: clientData.user_id || userId,
        date_of_birth: clientData.date_of_birth,
        blood_type: clientData.blood_type,
        allergies: clientData.allergies || undefined,
        medical_history: clientData.medical_history || undefined,
        emergency_contact: clientData.emergency_contact,
        emergency_contact_phone: clientData.emergency_contact_phone,
        insurance_provider: clientData.insurance_provider || undefined,
        insurance_number: clientData.insurance_number || undefined
      };

      const patient: PatientResponseData = await createPatient(validatedData);
      if (!patient || !patient.statusCode) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to create patient',
          data: null
        });
      }
      
      return res.status(patient.statusCode).json({
        status: patient.status,
        message: patient.message,
        data: patient.data
      });
    } catch (error) {
      console.log(error)
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.map(err => ({
          field: err.path || 'unknown',
          message: err.message,
          type: err.type
        }));

        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
        });
      }
      console.log(error)
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getPatients: async (req: ExpressRequest, res: Response) => {
    try {
      const searchData = await searchSchema.validate(req.body, { abortEarly: false, strict: true });
      const patients = await getPatients(searchData);
      return res.status(patients.statusCode).json({
        status: patients.status,
        message: patients.message,
        data: patients.data
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  getOnePatient: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const patient = await getOnePatient(Number(req.params.id));
      return res.status(patient.statusCode).send({
        status: patient.status,
        message: patient.message,
        data: patient.data
      });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  updatePatient: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id);
      const validatedData = await patientUpdateSchema.validate(req.body);
      const update = await updatePatient(id, validatedData);
      return res.status(update.statusCode).send({
        status: update.status,
        message: update.message,
        data: update.data
      });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  deletePatient: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const payload = await idSchema.validate(req.params.id);
      const deletePatientById = await deletePatient(Number(payload));
      return res.status(deletePatientById.statusCode).send({
        status: deletePatientById.status,
        message: deletePatientById.message,
        data: deletePatientById.data
      });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  }
};

export default patientController;