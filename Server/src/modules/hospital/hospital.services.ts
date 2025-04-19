import {CreationAttributes, Op as Operators } from 'sequelize';
import { Hospital } from './hospital.model';
import { getFromRedis, saveToRedis } from '../../core/redis';
import { SearchData } from '../types/type';

export const getHospitals = async (searchData?: SearchData) => {
  try {
    const search = searchData?.search || '';
    const page = searchData?.page || 1; 
    const limit = searchData?.limit || 10;
    const offset = (page - 1) * limit;
    
    const key = `fetch:hospitals:${search}:${page}:${limit}`;
    let fetchHospitals: string | null = await getFromRedis(key);
    
    if (fetchHospitals) {
      return {
        statusCode: 200,
        status: 'success',
        message: 'Hospitals fetched from cache',
        data: JSON.parse(fetchHospitals),
      };
    }

    const searchPattern = `%${search}%`;
    const hospitals = await Hospital.findAndCountAll({
      where: {
        [Operators.or]: [
          { name: { [Operators.iLike]: searchPattern } },
          { city: { [Operators.iLike]: searchPattern } },
          { state: { [Operators.iLike]: searchPattern } },
        ]
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    if (!hospitals || hospitals.count === 0) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'No hospitals found',
        data: null,
      };
    }

    const response = {
      total: hospitals.count,
      currentPage: page,
      totalPages: Math.ceil(hospitals.count / limit),
      hospitals: hospitals.rows
    };

    await saveToRedis(key, JSON.stringify(response), 2000);

    return {
      statusCode: 200,
      status: 'success',
      message: 'Hospitals fetched from database',
      data: response,
    };
  } catch (error) {
    console.error('Error in getHospitals service:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to fetch hospitals',
      data: null
    };
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
