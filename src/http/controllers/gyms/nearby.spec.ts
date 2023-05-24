import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('Should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Javascript gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -17.7581988,
        longitude: -48.6468979,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Typescript gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -17.1221945,
        longitude: -49.4162226,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -17.7581988,
        longitude: -48.6468979,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript gym'
      })
    ])
  })
})