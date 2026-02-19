const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await scryptAsync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

hashPassword('Test1234').then(hash => {
    console.log(JSON.stringify([{
        id: '1',
        email: 'apietrowicz87@gmail.com',
        passwordHash: hash,
        role: 'admin'
    }], null, 2));
});
