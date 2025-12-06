import crypto from "crypto";

export const generateSlug = (length = 8) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}