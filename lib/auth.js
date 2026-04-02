import crypto from "crypto";
import { cookies } from "next/headers";
import connectDB from "@/config/db";

export const AUTH_SESSION_COOKIE = "aqeela_session";
const SESSION_DAYS = 30;
const CODE_TTL_MINUTES = 10;

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function createLoginCode(email, code) {
  const sql = await connectDB();
  const normalizedEmail = normalizeEmail(email);

  await sql`
    DELETE FROM auth_login_codes
    WHERE email = ${normalizedEmail}
  `;

  await sql`
    INSERT INTO auth_login_codes (email, code_hash, expires_at)
    VALUES (
      ${normalizedEmail},
      ${sha256(String(code))},
      NOW() + (${String(CODE_TTL_MINUTES)} || ' minutes')::interval
    )
  `;
}

export async function verifyLoginCode(email, code) {
  const sql = await connectDB();
  const normalizedEmail = normalizeEmail(email);

  const [row] = await sql`
    SELECT id, code_hash, expires_at
    FROM auth_login_codes
    WHERE email = ${normalizedEmail}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!row) {
    return false;
  }

  const now = Date.now();
  const expires = new Date(row.expires_at).getTime();
  const isValid = sha256(String(code)) === row.code_hash && expires > now;

  if (isValid) {
    await sql`
      DELETE FROM auth_login_codes
      WHERE id = ${row.id}
    `;
  }

  return isValid;
}

export async function findOrCreateUserByEmail({ email, name }) {
  const sql = await connectDB();
  const normalizedEmail = normalizeEmail(email);
  const cleanName = String(name || "").trim();

  const [existingUser] = await sql`
    SELECT id, name, email, image_url
    FROM users
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `;

  if (existingUser) {
    if (!existingUser.name && cleanName) {
      const [updatedUser] = await sql`
        UPDATE users
        SET name = ${cleanName}, updated_at = NOW()
        WHERE id = ${existingUser.id}
        RETURNING id, name, email, image_url
      `;
      return updatedUser;
    }

    return existingUser;
  }

  const userId = `usr_${crypto.randomUUID().replace(/-/g, "")}`;
  const fallbackName = cleanName || normalizedEmail.split("@")[0] || "User";

  const [newUser] = await sql`
    INSERT INTO users (id, name, email, image_url)
    VALUES (${userId}, ${fallbackName}, ${normalizedEmail}, ${""})
    RETURNING id, name, email, image_url
  `;

  return newUser;
}

export async function createSessionForUser(userId) {
  const sql = await connectDB();
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(token);

  await sql`
    INSERT INTO auth_sessions (user_id, token_hash, expires_at)
    VALUES (
      ${userId},
      ${tokenHash},
      NOW() + (${String(SESSION_DAYS)} || ' days')::interval
    )
  `;

  return token;
}

export async function getAuthUserFromCookies() {
  const token = cookies().get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return null;

  const sql = await connectDB();
  const tokenHash = sha256(token);

  const [user] = await sql`
    SELECT u.id, u.name, u.email, u.image_url
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  return user || null;
}

export async function getAuthUserId() {
  const user = await getAuthUserFromCookies();
  return user?.id || null;
}

export async function clearCurrentSession() {
  const token = cookies().get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return;

  const sql = await connectDB();
  await sql`
    DELETE FROM auth_sessions
    WHERE token_hash = ${sha256(token)}
  `;
}
