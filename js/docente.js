// Verificar si el usuario tiene sesión activa y es docente
document.addEventListener("DOMContentLoaded", function () {
  let user = localStorage.getItem("user");
  let role = localStorage.getItem("rol"); // Se usa "rol" en vez de "role"

  if (!user || role !== "docente") {
    window.location.href = "../index.html"; // Redirigir si no es docente
  } else {
    let nombreDocente = document.getElementById("nombreDocente");
    if (nombreDocente) {
      nombreDocente.innerText = `Bienvenido, ${user}`;
    }
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
  let nombre = document.getElementById("nombre").value;
  let grado = document.getElementById("grado").value;
  let lista = document.getElementById("listaEstudiantes");

  let estudiante = document.createElement("p");
  estudiante.textContent = `${nombre} - ${grado}`;
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
  window.location.href = "index.html";
}

// Evento para agregar estudiantes al formulario
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formEstudiante").addEventListener("submit", agregarEstudiante);
});
