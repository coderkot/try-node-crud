import request from 'supertest'
import {app} from '../../src'
import {HTTP_STATUS} from "../../src/consts";
import {User} from "../../src/types";

describe('/users', () => {

    let createdUser: User | undefined;

    /** drop init data */
    beforeAll(async () => {
        await request(app).delete('/__test__/init-drop-users')
    })

    /** get users array (empty) */
    it('Should return code 200 and array of users', async () => {
        await request(app)
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [])
    })

    /** get no existing user */
    it('Should return code 404 of no existing user', async () => {
        await request(app)
            .get('/users/99999')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    /** create new user */
    it('Should return code 201 of create new user', async () => {
        await request(app)
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

    /** update user */
    it('Should return code 200 of update user', async () => {
        await request(app)
            .put(`/users/${createdUser?.id}`)
            .send({name: 'Alexander Userson'})
            .expect(HTTP_STATUS.OK_200, {id: createdUser?.id, name: 'Alexander Userson'})
    })

    /** get users array */
    it('Should return code 200 and array of users', async () => {
        await request(app)
            .get('/users')
            .expect(HTTP_STATUS.OK_200, [{id: createdUser?.id ,name: 'Alexander Userson'}])
    })

    /** get user */
    it('Should return code 200 and user object', async () => {
        await request(app)
            .get(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.OK_200, {id: createdUser?.id ,name: 'Alexander Userson'})
    })

    /** delete user */
    it('Should return code 204 of delete user', async () => {
        await request(app)
            .delete(`/users/${createdUser?.id}`)
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })
})