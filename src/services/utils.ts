import bcrypt from 'bcrypt';
import { verify } from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
   const salt = await bcrypt.genSalt();
   const hashedPassword = await bcrypt.hash(password, salt);
   return hashedPassword;
};

export const verifyPassword = async (
   userpassword: string,
   storedPassword: string
): Promise<boolean> => {
   const passwordMatched = await bcrypt.compare(userpassword, storedPassword);
   return passwordMatched;
};
