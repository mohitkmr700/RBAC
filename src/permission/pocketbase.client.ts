import PocketBase from 'pocketbase';

const apiDomain = process.env.POCKETBASE_URL || 'https://pocketbase.algoarena.co.in';

console.log('🔧 PocketBase API Domain:', apiDomain);
console.log('🔧 Environment variable POCKETBASE_URL:', process.env.POCKETBASE_URL);

export const pb = new PocketBase(apiDomain); 