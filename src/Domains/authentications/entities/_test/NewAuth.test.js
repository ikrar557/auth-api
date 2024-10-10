const NewAuth = require('../NewAuth');

describe('New Auth Test', () => {
    it('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            accessToken: 'accessToken',
        }

        // Action & Assert
        expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('should throw eerro when payload not meet data type needed', () => {
        // Arrange
        const payload = {
            accessToken: 'accessToken',
            refreshToken: 1234,
        }

        // Action & Assert
        expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should create NewAuth entities correctly', () => {
        const payload = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken'
        }

        // Action 
        const newAuth = new NewAuth(payload);

        // Assert
        expect(newAuth).toBeInstanceOf(NewAuth);
        expect(newAuth.accessToken).toEqual(payload.accessToken);
        expect(newAuth.refreshToken).toEqual(payload.refreshToken);
    });
})