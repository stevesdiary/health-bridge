import {CreationAttributes, Op as Operators } from 'sequelize';
import { Hospital } from '../models/hospital.model';
import { getFromRedis, saveToRedis } from '../../../core/redis';
import { SearchData } from '../../types/type';
import { fail } from 'assert';

export const getHospitals = async (searchData: SearchData) => {
  try {
    const key = 'fetch:allHospitals';

    let fetchHospitals: string | null = await getFromRedis(key);
    if (fetchHospitals) {
      return {
        statusCode: 200,
        status: 'success',
        message: 'Hospitals fetched from cache',
        data: JSON.parse(fetchHospitals),
      };
    }
    const searchTerm = searchData.search || '';
    const searchPattern = `%${searchTerm}%`;
    const hospitals = await Hospital.findAll({
      where: {
        [Operators.or]: [
          { name: { [Operators.iLike]: searchPattern } },
          { city: { [Operators.iLike]: searchPattern } },
          { state: { [Operators.iLike]: searchPattern } },
          // { specialization: { [Operators.iLike]: searchPattern } },
        ]
      }
    });

    if (!hospitals || hospitals.length === 0) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'No hospitals found',
        data: null,
      };
    }

    await saveToRedis(key, JSON.stringify(hospitals), 2000);

    return {
      statusCode: 200,
      status: 'success',
      message: 'Hospitals fetched from database',
      data: hospitals,
    };
  } catch (error) {
    console.error('Error in getHospitals service:', error);
    throw new Error('Failed to fetch hospitals');
  }
};

export const getOneHospital = async (id: string) => {
  try {
    const hospital = await Hospital.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
    if (!hospital) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Hospital record not found',
        data: []
      }
    }
    return {
      statusCode: 200,
      status: "success",
      message: "Hospital record found",
      data: hospital,
    };
  } catch (error) {
    console.log('Error showed up', error);
    throw error;
  }
}

export const updateHospital = async (id: string, hospitalData: CreationAttributes<Hospital>) => {
  try {
    const hospital = await Hospital.findByPk(id);
    if (!hospital) {
      return {
        statusCode: 404,
        status: "fail",
        message: "Hospital not found",
        data: [],
      };
    }
    const updatedHospital = await hospital.update(hospitalData);
    return {
      statusCode: 200,
      status: "success",
      message: "Hospital updated",
      data: updatedHospital,
    };
  } catch (error) {
    throw error;
  }
}

export const deleteHospital = async (id: string) => {
  try {
    const deletedRow = await Hospital.destroy({ where: { id }});
    if (!deletedRow || deletedRow === 0) {
      return {
        statusCode: 404,
        status: "fail",
        message: "Hospital not found",
        data: [],
      };
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Hospital deleted",
      data: deletedRow,
    };
  } catch (error) {
    throw error;
  }
}
