import fauna from 'faunadb';


export const client = new fauna.Client({ 
    secret: process.env.FAUNA_API_KEY,
    domain: 'db.us.fauna.com'
});