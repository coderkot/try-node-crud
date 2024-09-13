import request from 'supertest'
import {app} from '../../src'
import {HTTP_STATUS, STATUS_MESSAGES} from "../../src/consts"
import {User} from "../../src/types"

describe('/users', () => {

    // const serverListener = app.listen(3000)
    const server = request(app)

    let createdUser: User | undefined;

    /** drop init data */
    beforeAll(async () => {
        await request(app).delete('/__test__/init-drop-users')
    })

    /** get users array (empty) */
    it('Should return code 200 and array of users', async () => {
        await server
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [])
    })

    /** get no existing user */
    it('Should return code 404 of no existing user', async () => {
        await server
            .get('/users/99999')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** create new user with incorrect data */
    it('Should return code 400 of create new user with incorrect data', async () => {
        await server
            .post('/users')
            .expect(HTTP_STATUS.BAD_REQUEST_400, STATUS_MESSAGES.BODY_EMPTY_NAME)
    })

    /** create new user */
    it('Should return code 201 of create new user', async () => {
        await server
            .post('/users')
            .send({name: 'Test User'})
            .expect(HTTP_STATUS.CREATED_201)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String)
                    })
                )
                createdUser = response.body;
            })
    })

    /** update user with incorrect data */
    it('Should return code 400 of update user with incorrect data', async () => {
        await server
            .put(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.BAD_REQUEST_400, STATUS_MESSAGES.BODY_EMPTY_NAME)
    })

    /** update user with incorrect id */
    it('Should return code 404 of update user with incorrect id', async () => {
        await server
            .put(`/users/99999`)
            .expect(HTTP_STATUS.BAD_REQUEST_400)
    })

    /** update user */
    it('Should return code 200 of update user', async () => {
        await server
            .put(`/users/${createdUser?.id}`)
            .send({name: 'Alexander Userson'})
            .expect(HTTP_STATUS.OK_200, {id: createdUser?.id, name: 'Alexander Userson'})
    })

    /** get users array */
    it('Should return code 200 and array of users', async () => {
        await server
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [{id: createdUser?.id ,name: 'Alexander Userson'}])
    })

    /** get user */
    it('Should return code 200 and user object', async () => {
        await server
            .get(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.OK_200, {id: createdUser?.id ,name: 'Alexander Userson'})
    })

    /** get not existing user */
    it('Should return code 404 of not existing user', async () => {
        await server
            .get(`/users/100500`)
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** delete not existing user */
    it('Should return code 404 of delete not existing user', async () => {
        await server
            .delete(`/users/100500`)
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** delete user */
    it('Should return code 204 of delete user', async () => {
        await server
            .delete(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })

    afterAll(done => {
        done()
    })

})