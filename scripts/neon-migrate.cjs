const { neon } = require("@neondatabase/serverless");

function getDatabaseUrl() {
  const raw = process.env.DATABASE_URL || "";
  const cleaned = raw.trim().replace(/^['\"]|['\"]$/g, "");

  if (!cleaned) {
    throw new Error("DATABASE_URL is missing.");
  }

  return cleaned;
}

async function migrate() {
  const sql = neon(getDatabaseUrl());

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

  console.log("Neon migration completed.");
}

migrate().catch((error) => {
  console.error("Neon migration failed:", error.message);
  process.exit(1);
});
