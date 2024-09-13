import request from 'supertest'
import app from '../../src'
import {HTTP_STATUS, STATUS_MESSAGES} from "../../src/consts"
import {User} from "../../src/types"
import TestAgent from "supertest/lib/agent"

describe('/users', () => {

    const doRequest: TestAgent = request(app)
    let createdUser: User | undefined

    /** drop init data */
    beforeAll(async () => {
        await doRequest.delete('/__test__/init-drop-users')
    })

    /** get welcome message */
    it("Should return 200 and welcome message", async () => {
        await doRequest.get('/').expect(HTTP_STATUS.OK_200, STATUS_MESSAGES.WELCOME)
    })

    /** get users array (empty) */
    it('Should return code 200 and array of users', async () => {
        await doRequest.get('/users').expect(HTTP_STATUS.OK_200, [])
    })

    /** get no existing user */
    it('Should return code 404 of no existing user', async () => {
        await doRequest.get('/users/99999').expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** create new user with incorrect data */
    it('Should return code 400 of create new user with incorrect data', async () => {
        await doRequest.post('/users').expect(HTTP_STATUS.BAD_REQUEST_400, STATUS_MESSAGES.BODY_EMPTY_NAME)

        await doRequest.get('/users').expect(HTTP_STATUS.OK_200, [])
    })

    /** create new user */
    it('Should return code 201 of create new user', async () => {
        const createResponse = await doRequest
            .post('/users')
            .send({name: 'Test User'})
            .expect(HTTP_STATUS.CREATED_201)

        createdUser = createResponse.body

        expect(createdUser).toEqual({
            id: expect.any(Number),
            name: 'Test User',
        })
    })

    /** update user with incorrect data */
    it('Should return code 400 of update user with incorrect data', async () => {
        await doRequest
            .put(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.BAD_REQUEST_400, STATUS_MESSAGES.BODY_EMPTY_NAME)

        await doRequest
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [createdUser])
            .then(response => {
                expect(response.body).toEqual([createdUser])
            })
    })

    /** update user with incorrect id */
    it('Should return code 404 of update user with incorrect id', async () => {
        await doRequest.put(`/users/99999`).expect(HTTP_STATUS.BAD_REQUEST_400)
    })

    /** update user */
    it('Should return code 200 of update user', async () => {
        await doRequest
            .put(`/users/${createdUser?.id}`)
            .send({name: 'Alexander Userson'})
            .expect(HTTP_STATUS.OK_200, {id: createdUser?.id, name: 'Alexander Userson'})
    })

    /** get users array */
    it('Should return code 200 and array of users', async () => {
        await doRequest
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [{id: createdUser?.id ,name: 'Alexander Userson'}])
    })

    /** get user by ID */
    it('Should return code 200 and user object', async () => {
        await doRequest
            .get(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.OK_200, {id: createdUser?.id ,name: 'Alexander Userson'})
    })

    /** get user by NAME query parameter */
    it('Should return code 200 and user object', async () => {
        await doRequest
            .get(`/users`)
            .query({name: 'userson'})
            .expect(HTTP_STATUS.OK_200, [{id: createdUser?.id ,name: 'Alexander Userson'}])
    })

    /** get not existing user */
    it('Should return code 404 of not existing user', async () => {
        await doRequest.get(`/users/100500`).expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** delete not existing user */
    it('Should return code 404 of delete not existing user', async () => {
        await doRequest.delete(`/users/100500`).expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** delete user */
    it('Should return code 204 of delete user', async () => {
        await doRequest.delete(`/users/${createdUser?.id}`).expect(HTTP_STATUS.NO_CONTENT_204)

        await doRequest.get('/users').expect(HTTP_STATUS.OK_200, [])
    })

})