// Verificar si el usuario tiene sesión activa y es docente
document.addEventListener("DOMContentLoaded", function () {
  let user = localStorage.getItem("user");
  let role = localStorage.getItem("rol"); // Se usa "rol" en vez de "role"

  // Solo mostrar mensaje, no redirigir
  let nombreDocente = document.getElementById("nombreDocente");
  if (nombreDocente && user) {
    nombreDocente.innerText = `Bienvenido, ${user}`;
  }
});

// Manejo de secciones
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// Agregar estudiante a la lista
function agregarEstudiante(event) {
  event.preventDefault();
  // Obtener valores del formulario
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
  const sexo = document.getElementById("sexo").value;
  const nacionalidad = document.getElementById("nacionalidad").value;
  const departamento = document.getElementById("departamento").value;
  const municipio = document.getElementById("municipio").value;
  const lugar_residencia = document.getElementById("lugar_residencia").value;
  const nivel_estudios = document.getElementById("nivel_estudios").value;
  const institucion_procedencia = document.getElementById("institucion_procedencia").value;
  const anio_graduacion = document.getElementById("anio_graduacion").value;
  const programa = document.getElementById("programa").value;

  // Mostrar los datos en la lista
  const lista = document.getElementById("listaEstudiantes");
  const estudiante = document.createElement("div");
  estudiante.className = "alert alert-secondary mt-2";
  estudiante.innerHTML = `<b>${nombre} ${apellido}</b> | Nacimiento: ${fecha_nacimiento} | Sexo: ${sexo} | Nacionalidad: ${nacionalidad} | Departamento: ${departamento} | Municipio: ${municipio} | Residencia: ${lugar_residencia} | Nivel: ${nivel_estudios} | Institución: ${institucion_procedencia} | Año: ${anio_graduacion} | Programa: ${programa}`;
  lista.appendChild(estudiante);

  document.getElementById("formEstudiante").reset();
}

// Guardar una nueva directriz
function guardarDirectriz() {
  let directriz = document.getElementById("nuevaDirectriz").value;
  let lista = document.getElementById("listaDirectrices");

  let item = document.createElement("li");
  item.textContent = directriz;
  lista.appendChild(item);

  document.getElementById("nuevaDirectriz").value = "";
}

// Guardar una nota para un estudiante
function guardarNota() {
  let estudiante = document.getElementById("notaEstudiante").value;
  let nota = document.getElementById("notaValor").value;
  let lista = document.getElementById("listaNotas");

  let item = document.createElement("li");
  item.textContent = `${estudiante}: ${nota}`;
  lista.appendChild(item);

  document.getElementById("notaEstudiante").value = "";
  document.getElementById("notaValor").value = "";
}

// Cerrar sesión
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("rol");
  // No redirigir a ningún lado
}

// Evento para agregar estudiantes al formulario
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formEstudiante").addEventListener("submit", agregarEstudiante);
});

