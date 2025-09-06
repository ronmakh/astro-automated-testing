import * as dotenv from 'dotenv';

export function getBaseUrl(): string {
    dotenv.config();
    
    return process.env.BASE_URL as string;
}
