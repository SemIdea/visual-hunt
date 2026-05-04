import bcrypt from "bcrypt";

export const hashPassword = (password: string, cost: number): Promise<string> => {
    return bcrypt.hash(password, cost);
};

export const verifyPassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
