import pg from 'pg'
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg

const client = new Client({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

export const mentorship = new Client({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASEMENTOR,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})
// client.connect()
//   .then(() => {
//     console.log("Connected to Client")
//   })

export default client;