import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export const decodeToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, jwtSecret as string) as any;
        return decoded; // This will return the decoded payload
    } catch (error) {
        return null; // Return null if token is invalid
    }
};
