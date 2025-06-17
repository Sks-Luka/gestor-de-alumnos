const tabla = document.getElementById("tabla-alumnos");
const form = document.getElementById("form-alumno");
const filtro = document.getElementById("filtro");

let alumnos = [];

function cargarAlumnos() {
  fetch("/api/alumnos")
    .then((res) => res.json())
    .then((data) => {
      alumnos = data;
      mostrarAlumnos(alumnos);
    });
}

function mostrarAlumnos(lista) {
  tabla.innerHTML = "";
  lista.forEach((alumno) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${alumno.nombre}</td>
      <td>${alumno.apellido}</td>
      <td>${alumno.correo}</td>
      <td>${alumno.carrera}</td>
      <td>
        <button onclick="editar(${alumno.id})">Editar</button>
        <button onclick="eliminar(${alumno.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

form.onsubmit = (e) => {
  e.preventDefault();
  const alumno = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    correo: form.correo.value,
    carrera: form.carrera.value,
  };

  const id = form.id.value;

  if (id) {
    fetch(`/api/alumnos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    }).then(() => {
      form.reset();
      cargarAlumnos();
    });
  } else {
    fetch("/api/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    }).then(() => {
      form.reset();
      cargarAlumnos();
    });
  }
};

function editar(id) {
  const alumno = alumnos.find((a) => a.id === id);
  form.id.value = alumno.id;
  form.nombre.value = alumno.nombre;
  form.apellido.value = alumno.apellido;
  form.correo.value = alumno.correo;
  form.carrera.value = alumno.carrera;
}

function eliminar(id) {
  if (confirm("¿Seguro que querés eliminar este alumno?")) {
    fetch(`/api/alumnos/${id}`, { method: "DELETE" }).then(() =>
      cargarAlumnos()
    );
  }
}

filtro.oninput = () => {
  const texto = filtro.value.toLowerCase();
  const filtrados = alumnos.filter(
    (a) =>
      a.nombre.toLowerCase().includes(texto) ||
      a.apellido.toLowerCase().includes(texto) ||
      a.carrera.toLowerCase().includes(texto)
  );
  mostrarAlumnos(filtrados);
};

cargarAlumnos();
