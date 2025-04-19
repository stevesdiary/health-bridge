import { Patient } from './patient.model';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

export const createPatient = async (data: CreatePatientDto) => {
  try {
    const createPatient = await Patient.create({
      user_id: data.user_id,
      date_of_birth: data.date_of_birth,
      blood_type: data.blood_type,
      allergies: data.allergies,
      medical_history: data.medical_history,
      emergency_contact: data.emergency_contact,
      emergency_contact_phone: data.emergency_contact_phone,
      insurance_provider: data.insurance_provider,
      insurance_number: data.insurance_number
    });
    
    if (!createPatient) {
      return {
        statusCode: 400,
        status: "Error",
        message: "Unable to register patient",
        data: null
      }
    }
    return {
      statusCode: 201,
      status: 'success',
      message: 'Patient created successfully',
      data: createPatient
    };
  } catch (error) {
    throw error;
  }
};

export const getPatients = async (searchData: any) => {
  try {
    const patients = await Patient.findAll({
      include: ['user', 'appointments', 'payments'],
      where: searchData
    });
    return {
      statusCode: 200,
      status: 'success',
      message: 'Patients retrieved successfully',
      data: patients
    };
  } catch (error) {
    throw error;
  }
};

export const getOnePatient = async (id: number) => {
  try {
    const patient = await Patient.findByPk(id, {
      include: ['user', 'appointments', 'payments']
    });
    if (!patient) {
      return {
        statusCode: 404,
        status: 'error',
        message: 'Patient not found',
        data: null
      };
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Patient retrieved successfully',
      data: patient
    };
  } catch (error) {
    throw error;
  }
};

export const updatePatient = async (id: number, data: UpdatePatientDto) => {
  try {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return {
        statusCode: 404,
        status: 'error',
        message: 'Patient not found',
        data: null
      };
    }
    await patient.update(data);
    return {
      statusCode: 200,
      status: 'success',
      message: 'Patient updated successfully',
      data: patient
    };
  } catch (error) {
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to update patient',
      data: null
    };
  }
};

export const deletePatient = async (id: number) => {
  try {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return {
        statusCode: 404,
        status: 'error',
        message: 'Patient not found',
        data: null
      };
    }
    await patient.destroy();
    return {
      statusCode: 200,
      status: 'success',
      message: 'Patient deleted successfully',
      data: null
    };
  } catch (error) {
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to delete patient',
      data: null
    };
  }
};