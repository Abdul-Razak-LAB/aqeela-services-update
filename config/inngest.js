import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "chericheri-store" });

// innest function to save user data to the database
export const syncUserCreation = inngest.createFunction(
    {
         id:'sync-user-from-clerk'
    },
    { event: 'clerk/user.created'},
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
                const sql = await connectDB()
                await sql`
                    INSERT INTO users (id, name, email, image_url)
                    VALUES (
                        ${id},
                        ${`${first_name || ""} ${last_name || ""}`.trim() || "User"},
                        ${email_addresses?.[0]?.email_address || ""},
                        ${image_url || ""}
                    )
                    ON CONFLICT (id)
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        email = EXCLUDED.email,
                        image_url = EXCLUDED.image_url,
                        updated_at = NOW()
                `
    })

    // Update user data in database
     export const syncUserUpdation = inngest.createFunction(
        {
            id: 'update-user-from-clerk'
        },
                { event: 'clerk/user.updated' },
        async ({event}) => {
                const { id, first_name, last_name, email_addresses, image_url } = event.data
                const sql = await connectDB()
                await sql`
                    INSERT INTO users (id, name, email, image_url)
                    VALUES (
                        ${id},
                        ${`${first_name || ""} ${last_name || ""}`.trim() || "User"},
                        ${email_addresses?.[0]?.email_address || ""},
                        ${image_url || ""}
                    )
                    ON CONFLICT (id)
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        email = EXCLUDED.email,
                        image_url = EXCLUDED.image_url,
                        updated_at = NOW()
                `
        }
    )
    

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({event}) => {
        const {id } = event.data

        const sql = await connectDB()
        await sql`DELETE FROM users WHERE id = ${id}`

    }
)