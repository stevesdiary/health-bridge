import {Op as Operators } from 'sequelize';
import { Hospital } from '../models/hospital.model';
import { getFromRedis, saveToRedis } from '../../../core/redis';
import { SearchData } from '../../types/type';

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
          { specialization: { [Operators.iLike]: searchPattern } },
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
    
  } catch (error) {
    console.log('Error showed up', error);
    throw error;
  }
}
