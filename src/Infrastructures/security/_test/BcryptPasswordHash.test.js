const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
    describe('hash function', () => {
        it('should encrypt password correctly', async () => {
            // Arrange
            const spyHash = jest.spyOn(bcrypt, 'hash');
            const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

            // Action
            const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

            // Assert
            expect(typeof encryptedPassword).toBe('string');
            expect(encryptedPassword).not.toEqual('plain_password');
            expect(spyHash).toHaveBeenCalledWith('plain_password', 10); //10 adalah nilai saltround
        })
    })
})