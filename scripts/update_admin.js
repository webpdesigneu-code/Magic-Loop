const crypto = require('crypto');
const util = require('util');

const scryptAsync = util.promisify(crypto.scrypt);

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64));
    return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
    const email = "apietrowicz87@gmail.com";
    const password = "MagicLoop2024!";
    const hash = await hashPassword(password);
    
    console.log(JSON.stringify([
        {
            "id": "1",
            "email": email,
            "passwordHash": hash,
            "role": "admin"
        }
    ], null, 4));
}

main();
