import bcrypt from "bcryptjs";

export const signBcrypt = (inPassword : string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(inPassword, salt);
}

export const verifyBcrypt = (inPassword : string, dbPassword : string) => {
    return bcrypt.compareSync(inPassword, dbPassword);
}