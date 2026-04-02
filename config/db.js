import { neon } from "@neondatabase/serverless";

let sqlClient = null;
let schemaReadyPromise = null;

function getDatabaseUrl() {
    const rawDatabaseUrl = process.env.DATABASE_URL || "";
    const databaseUrl = rawDatabaseUrl.trim().replace(/^['\"]|['\"]$/g, "");

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing.");
    }

    return databaseUrl;
}

export function getSql() {
    if (!sqlClient) {
        sqlClient = neon(getDatabaseUrl());
    }

    return sqlClient;
}

export async function ensureNeonSchema() {
    if (!schemaReadyPromise) {
        const sql = getSql();

        schemaReadyPromise = (async () => {
            await sql`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    image_url TEXT NOT NULL,
                    cart_items JSONB NOT NULL DEFAULT '{}'::jsonb,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS consultations (
                    id BIGSERIAL PRIMARY KEY,
                    full_name TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    email TEXT NOT NULL,
                    city_area TEXT NOT NULL DEFAULT '',
                    topic TEXT NOT NULL,
                    crop_type TEXT NOT NULL DEFAULT '',
                    preferred_date TEXT NOT NULL,
                    preferred_time TEXT NOT NULL,
                    requirement TEXT NOT NULL DEFAULT '',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS addresses (
                    id BIGSERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    pincode TEXT NOT NULL,
                    area TEXT NOT NULL,
                    city TEXT NOT NULL,
                    state TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS addresses_user_id_idx
                ON addresses (user_id)
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    items JSONB NOT NULL,
                    address JSONB NOT NULL,
                    sub_total NUMERIC(12, 2) NOT NULL,
                    tax NUMERIC(12, 2) NOT NULL,
                    amount NUMERIC(12, 2) NOT NULL,
                    status TEXT NOT NULL DEFAULT 'Order Placed',
                    payment_type TEXT NOT NULL DEFAULT 'COD',
                    payment TEXT NOT NULL DEFAULT 'Pending',
                    payment_session_id TEXT NOT NULL DEFAULT '',
                    date BIGINT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS orders_user_id_idx
                ON orders (user_id)
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS orders_payment_session_id_idx
                ON orders (payment_session_id)
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS auth_login_codes (
                    id BIGSERIAL PRIMARY KEY,
                    email TEXT NOT NULL,
                    code_hash TEXT NOT NULL,
                    expires_at TIMESTAMPTZ NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS auth_login_codes_email_idx
                ON auth_login_codes (email)
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS auth_sessions (
                    id BIGSERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    token_hash TEXT NOT NULL UNIQUE,
                    expires_at TIMESTAMPTZ NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;

            await sql`
                CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx
                ON auth_sessions (user_id)
            `;
        })();
    }

    await schemaReadyPromise;
}

async function connectDB() {
    await ensureNeonSchema();
    return getSql();
}

export default connectDB