import { deleteUser, getAllUsers, getOneUser, updateUser } from './services/user.service';
import { idSchema, userUpdateSchema } from '../../utils/validator';
import { UserResponseData } from '../types/type';
import { Response, Request as ExpressRequest } from 'express';
import { handleError } from '../../middlewares/error.handler';



const UserController = {
  getAllUsers: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const users: UserResponseData = await getAllUsers();
      return res.status(users.statusCode).send({
        status: users.status,
        message: users.message,
        data: users.data
      });
    } catch (error: any) {
      const errorResponse = handleError(error as Error);
      return res.status(errorResponse.statusCode).json(errorResponse.message);
      };
  },

  getOneUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const user = await getOneUser(req.params.id);
      return res.status(user.statusCode).send({ 
        status: (user.status), 
        message: (user.message), 
        data: (user.data)
      })
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: error
      })
    }
  },

  updateUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const id = req.params.id;
      const validatedData = await userUpdateSchema.validate(req.body, req.params);
      const update = await updateUser( id, validatedData);
      return res.status(update.statusCode).send({ status: (update.status), message: (update.message), data: (update.data)})
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  deleteUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const payload = await idSchema.validate(req.params.id);

      const deleteUserById = await deleteUser(payload);
      return res.status(deleteUserById.statusCode).send({
        status: deleteUserById.status,
        message: deleteUserById.message,
        data: deleteUserById.data
      })
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  }
}

export default UserController;
