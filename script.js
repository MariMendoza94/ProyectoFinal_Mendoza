let profesionales = [];
let comentariosPorProfesional = {};

document.addEventListener("DOMContentLoaded", async () => {
  const ciudadSelect = document.getElementById("filtroCiudad");
  const profesionSelect = document.getElementById("filtroProfesion");
  const btnFiltrar = document.getElementById("btnFiltrar");
  const btnLimpiar = document.getElementById("btnLimpiar");
  const contenedor = document.getElementById("contenedor");

  const datos = document.getElementById("datos");
  const cerrarDatos = document.getElementById("cerrarDatos");
  const datosNombre = document.getElementById("datosNombre");
  const nuevoComentario = document.getElementById("nuevoComentario");
  const btnAgregarComentario = document.getElementById("btnAgregarComentario");

  try {
    const res = await fetch("datos.json");
    profesionales = await res.json();

    cargarComentarios();

    llenarSelects(profesionales);
    mostrarProfesionales(profesionales);
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar datos.</p>";
    console.error(error);
  }

  btnFiltrar.addEventListener("click", () => {
    const ciudad = ciudadSelect.value;
    const profesion = profesionSelect.value;

    const filtrados = profesionales.filter(p => {
      return (ciudad === "" || p.ciudad === ciudad) &&
             (profesion === "" || p.profesion === profesion);
    });

    if (filtrados.length > 0) {
      mostrarProfesionales(filtrados);
    } else {
      contenedor.innerHTML = "<p>No se encontró ningún profesional en esa área.</p>";
    }
  });

  btnLimpiar.addEventListener("click", () => {
    ciudadSelect.value = "";
    profesionSelect.value = "";
    mostrarProfesionales(profesionales);
  });

  cerrarDatos.addEventListener("click", () => {
    datos.classList.add("hidden");
    nuevoComentario.value = "";
  });

  btnAgregarComentario.addEventListener("click", () => {
    const texto = nuevoComentario.value.trim();
    if (texto === "") {
      alert("Por favor, escribe un comentario antes de agregar.");
      return;
    }
    const nombreProf = datosNombre.textContent;
    if (!comentariosPorProfesional[nombreProf]) {
      comentariosPorProfesional[nombreProf] = [];
    }
    comentariosPorProfesional[nombreProf].push(texto);
    guardarComentarios();
    mostrarComentarios(nombreProf);
    nuevoComentario.value = "";
  });
});

function llenarSelects(profesionales) {
  const ciudadSelect = document.getElementById("filtroCiudad");
  const profesionSelect = document.getElementById("filtroProfesion");

  const ciudades = [...new Set(profesionales.map(p => p.ciudad))].filter(Boolean);
  const profesiones = [...new Set(profesionales.map(p => p.profesion))].filter(Boolean);

  ciudades.forEach(ciudad => {
    const opt = document.createElement("option");
    opt.value = ciudad;
    opt.textContent = ciudad;
    ciudadSelect.appendChild(opt);
  });

  profesiones.forEach(profesion => {
    const opt = document.createElement("option");
    opt.value = profesion;
    opt.textContent = profesion;
    profesionSelect.appendChild(opt);
  });
}

function mostrarProfesionales(lista) {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  lista.forEach(p => {
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p><strong>Profesión:</strong> ${p.profesion || ''}</p>
      <p><strong>Ciudad:</strong> ${p.ciudad || ''}</p>
      <p><strong>Email:</strong> ${p.email || ''}</p>
      <p><strong>Teléfono:</strong> <a href="https://wa.me/${p.telefono.replace(/\D/g, '')}" target="_blank">${p.telefono }</p>
      <img src="${p.foto}" alt="${p.nombre}" class="foto-profesional"/>
    `;

    div.addEventListener("click", () => abrirDatos(p));
    contenedor.appendChild(div);
  });
}

function abrirDatos(profesional) {
  const datos = document.getElementById("datos");
  const datosFoto = document.getElementById("datosFoto");
  const datosNombre = document.getElementById("datosNombre");
  const datosProfesion = document.getElementById("datosProfesion");
  const datosCiudad = document.getElementById("datosCiudad");
  const datosEmail = document.getElementById("datosEmail");
  const datosTelefono = document.getElementById("datosTelefono");

  datosFoto.src = profesional.foto;
  datosFoto.alt = profesional.nombre;
  datosNombre.textContent = profesional.nombre;
  datosProfesion.textContent = ` Teléfono: ${profesional.profesion || ''}`;
  datosCiudad.textContent = ` Ciudad: ${profesional.ciudad || ''}` ;
  datosEmail.textContent = `Email: ${profesional.email || ''}`;
  datosTelefono.textContent = `Teléfono: ${profesional.telefono || ''}`;

  mostrarComentarios(profesional.nombre);

  datos.classList.remove("hidden");
}

function mostrarComentarios(nombreProf) {
  const listaComentarios = document.getElementById("listaComentarios");
  listaComentarios.innerHTML = "";

  const comentarios = comentariosPorProfesional[nombreProf] || [];

  comentarios.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    listaComentarios.appendChild(li);
  });
}

function guardarComentarios() {
  localStorage.setItem("comentariosPorProfesional", JSON.stringify(comentariosPorProfesional));
}

function cargarComentarios() {
  const guardados = localStorage.getItem("comentariosPorProfesional");
  comentariosPorProfesional = guardados ? JSON.parse(guardados) : {};
}