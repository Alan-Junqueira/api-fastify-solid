import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe('Register (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('Should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: "Jhon Doe",
        email: "jhondoe@example.com",
        password: "123456"
      })

    expect(response.statusCode).toEqual(201)
  })
})