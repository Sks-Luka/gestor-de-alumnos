const request = require("supertest");
const app = require("../server/server"); // Importás tu app  // esto lo ajustamos si hace falta exportar app

describe("API de Alumnos", () => {
  it("debería retornar un array de alumnos", async () => {
    const res = await request(app).get("/api/alumnos");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("debería permitir crear un alumno nuevo", async () => {
    const nuevo = {
      nombre: "Lucas",
      apellido: "Test",
      correo: "lucas@test.com",
      carrera: "QA",
    };
    const res = await request(app).post("/api/alumnos").send(nuevo);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });
});
