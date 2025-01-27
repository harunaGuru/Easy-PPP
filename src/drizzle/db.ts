import { serverEnv } from '@/data/env/server';
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const sql = neon(serverEnv.DATABASE_URL)
export const db = drizzle(sql, { schema, logger: true })



// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import * as schema from "./schema"
// import { serverEnv } from '@/data/server';

// const sql = neon(serverEnv.DATABASE_URL);
// export const db = drizzle({ client: sql }, {schema, logger:true});





// import { serverEnv } from '@/data/server';
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';


// const sql = neon(serverEnv.DATABASE_URL);
// export const db = drizzle({ client: sql });
