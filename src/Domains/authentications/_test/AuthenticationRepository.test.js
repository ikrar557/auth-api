const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
    it('should throw error when invoke abstract behaviour', async () => {
        const auhtenticationRepository = new AuthenticationRepository()

        await expect(auhtenticationRepository.addToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(auhtenticationRepository.checkAvailabilityToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(auhtenticationRepository.deleteToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    })
})