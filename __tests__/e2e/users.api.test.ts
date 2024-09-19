import request from 'supertest'
import {app} from "../../src/app"
import {HTTP_STATUS, STATUS_MESSAGES} from "../../src/consts"
import {UsersType} from "../../src/types/common-types"
import TestAgent from "supertest/lib/agent"
import {UserCreateModel} from "../../src/models/UserCreateModel"
import {UserQueryModel} from "../../src/models/GetUserQueryModel"
import {UserUpdateModel} from "../../src/models/UserUpdateModel"

jest.useRealTimers();

describe('/users', () => {

    const doRequest = (): TestAgent => request(app)
    let createdUser: UsersType | undefined

    /** drop init data */
    beforeAll(async () => {
        await doRequest().delete('/__test__/init-drop-users')
    })

    /** get welcome message */
    it("Should return 200 and welcome message", async () => {
        await doRequest().get('/').expect(HTTP_STATUS.OK_200, STATUS_MESSAGES.WELCOME)
    })

    /** get users array (empty) */
    it('Should return code 200 and array of users', async () => {
        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [])
    })

    /** get no existing user */
    it('Should return code 404 of no existing user', async () => {
        await doRequest().get('/users/99999').expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** create new user with incorrect data */
    it('Should return code 400 of create new user with incorrect data', async () => {
        await doRequest().post('/users').expect(HTTP_STATUS.BAD_REQUEST_400, STATUS_MESSAGES.EMPTY_DATA)

        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [])
    })

    /** create new user */
    it('Should return code 201 of create new user', async () => {
        const data: UserCreateModel = {name: 'Test User', email: 'test@test.com'};
        const createResponse = await doRequest()
            .post('/users')
            .send(data)
            .expect(HTTP_STATUS.CREATED_201)

        createdUser = createResponse.body

        const user: UsersType = {
            id: expect.any(Number),
            name: 'Test User',
        };
        expect(createdUser).toEqual(user)

        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [createdUser])
    })

    /** update user with incorrect data */
    it('Should return code 400 of update user with incorrect data', async () => {
        await doRequest()
            .put(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.BAD_REQUEST_400, STATUS_MESSAGES.BODY_EMPTY_NAME)

        await doRequest()
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [createdUser])
            .then(response => {
                expect(response.body).toEqual([createdUser])
            })
    })

    /** update user with incorrect id */
    it('Should return code 404 of update user with incorrect id', async () => {
        await doRequest().put(`/users/99999`).expect(HTTP_STATUS.BAD_REQUEST_400)

        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [createdUser])
    })

    /** update user */
    it('Should return code 200 of update user', async () => {
        const data: UserUpdateModel = {name: 'Alexander Userson'};
        const createResponse = await doRequest()
            .put(`/users/${createdUser?.id}`)
            .send(data)
            .expect(HTTP_STATUS.OK_200)

        createdUser = createResponse.body
        expect(createdUser).toEqual(createdUser)

        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [createdUser])
    })

    /** get users array */
    it('Should return code 200 and array of users', async () => {
        const data: UsersType = {id: createdUser?.id as number, name: 'Alexander Userson'};
        await doRequest()
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [data])
    })

    /** get user by ID */
    it('Should return code 200 and user object', async () => {
        await doRequest()
            .get(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.OK_200, createdUser)
    })

    /** get user by NAME query parameter */
    it('Should return code 200 and user object', async () => {
        const data: UserQueryModel = {name: 'userson'};
        await doRequest()
            .get(`/users`)
            .query(data)
            .expect(HTTP_STATUS.OK_200, [createdUser])
    })

    /** get not existing user */
    it('Should return code 404 of not existing user', async () => {
        await doRequest().get(`/users/100500`).expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** delete not existing user */
    it('Should return code 404 of delete not existing user', async () => {
        await doRequest().delete(`/users/100500`).expect(HTTP_STATUS.NOT_FOUND_404)

        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [createdUser])
    })

    /** delete user */
    it('Should return code 204 of delete user', async () => {
        await doRequest().delete(`/users/${createdUser?.id}`).expect(HTTP_STATUS.NO_CONTENT_204)

        await doRequest().get('/users').expect(HTTP_STATUS.OK_200, [])
    })

    afterAll(done => done())

})