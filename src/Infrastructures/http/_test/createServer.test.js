const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP Server', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
      });

    it('should response 404 when request unregistered route', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
            method: 'POST',
            url: '/unregisteredRoute',
        });

        // Assert
        expect(response.statusCode).toEqual(404);
    })  

    describe('when POST /users', () => {
        it('should response 201 and persisted user', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedUser).toBeDefined();
        })

        it('should response 400 when request payload not valid', async () => {
            // Arrange
            const requestPayload = {
                fullname: 'Dicoding Indonesia',
                password: 'secret',
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            })

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
        })

        it('should response 400 when reqeust payload not meet data type specification', async () => {

            const requestPayload = {
                username: 'dicoding',
                password: 'secret',
                fullname: ['Dicoding Indonesia'],
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            })

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
        })

        it('should response 400 when username more than 50 char', async () => {
            // Arrange
            const requestPayload = {
                username: 'a'.repeat(52),
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            })

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit')
        })

        it('should response 400 when username contain restricted character', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding<script>',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            })

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
        })

        it('should response 400 when username unavailable', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ username: 'dicoding' });
            const requestPayload = {
              username: 'dicoding',
              fullname: 'Dicoding Indonesia',
              password: 'super_secret',
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
              method: 'POST',
              url: '/users',
              payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('username tidak tersedia');
        })
    })

    it('should handle server error correctly', async () => {
        // Arrange
        const requestPayload = {
          username: 'dicoding',
          fullname: 'Dicoding Indonesia',
          password: 'super_secret',
        };
        const server = await createServer({}); // fake container
        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/users',
          payload: requestPayload,
        });
        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(500);
        expect(responseJson.status).toEqual('error');
        expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
      });
})