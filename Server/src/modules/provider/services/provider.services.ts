import {Op as Operators } from 'sequelize';
import { Provider } from '../models/provider.model';
import { getFromRedis, saveToRedis } from '../../../core/redis';
import { SearchData } from '../../types/type';

export const getProviders = async (searchData: SearchData) => {
  try {
    const key = 'fetch:allProviders';

    let fetchProviders: string | null = await getFromRedis(key);
    if (fetchProviders) {
      return {
        statusCode: 200,
        status: 'success',
        message: 'Providers fetched from cache',
        data: JSON.parse(fetchProviders),
      };
    }
    const searchTerm = searchData.search || '';
    const searchPattern = `%${searchTerm}%`;
    const providers = await Provider.findAll({
      where: {
        [Operators.or]: [
          { name: { [Operators.iLike]: searchPattern } },
          { city: { [Operators.iLike]: searchPattern } },
          { state: { [Operators.iLike]: searchPattern } },
          { specialization: { [Operators.iLike]: searchPattern } },
        ]
      }
    });

    if (!providers || providers.length === 0) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'No providers found',
        data: null,
      };
    }

    await saveToRedis(key, JSON.stringify(providers), 2000);

    return {
      statusCode: 200,
      status: 'success',
      message: 'Providers fetched from database',
      data: providers,
    };
  } catch (error) {
    console.error('Error in getProviders service:', error);
    throw new Error('Failed to fetch providers');
  }
};

export const getOneProvider = async (id: string) => {
  try {
    
  } catch (error) {
    console.log('Error showed up', error);
    throw error;
  }
}
