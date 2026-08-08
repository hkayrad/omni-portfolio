import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const BCRYPT_SALT_ROUNDS = 14; // Explicitly configured to 14 salt rounds as requested
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-portfolio-jwt-key-change-in-prod';
const JWT_EXPIRES_IN = '7d';

export interface UserPayload {
  id: string;
  username: string;
}

/**
 * Hashes a plaintext password using bcrypt with 14 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generates a signed JWT authentication token
 */
export function generateToken(user: UserPayload): string {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verifies a JWT authentication token
 */
export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}
