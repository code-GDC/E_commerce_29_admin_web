import jwt, { JwtPayload } from 'jsonwebtoken';

export const getAdminNameFromToken = (token: string): string => {
  try {
    const decodedToken = jwt.decode(token) as JwtPayload;
    console.log("🚀 ~ getAdminNameFromToken ~ decodedToken:", decodedToken);

    return typeof decodedToken === 'object' && 'adminUserName' in decodedToken
      ? (decodedToken.adminUserName as string)
      : 'Not Authorized';
  } catch (error) {
    console.error('Invalid token', error);
    return 'Not Authorized';
  }
};