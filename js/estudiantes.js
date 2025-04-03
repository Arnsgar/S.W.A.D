// Verificar si hay una sesión activa
document.addEventListener("DOMContentLoaded", function () {
  let user = localStorage.getItem("user");
  let role = localStorage.getItem("rol"); // Se corrige el nombre de la clave

  console.log("Usuario:", user);
  console.log("Rol:", role);

  if (!user || role !== "estudiante") {
      console.warn("Acceso denegado. Redirigiendo a index.html...");
      window.location.href = "index.html"; // Ajustar ruta si es necesario
  } else {
      document.getElementById("nombreEstudiante").innerText = user;
  }
});

// Simulación de cursos certificados y progreso
const cursosCertificados = [
  { nombre: "Soporte Vital Básico", horas: 40, aprobado: true },
  { nombre: "Soporte Vital Avanzado", horas: 40, aprobado: false },
  { nombre: "Conducción de Vehículo de Emergencia", horas: 40, aprobado: true }
];

function verCursos() {
  let contenido = document.getElementById("contenido");
  let cursosHTML = "<h3>📚 Cursos Certificados</h3><ul>";
  
  cursosCertificados.forEach(curso => {
      let estado = curso.aprobado ? "✅ Aprobado" : "❌ Pendiente";
      cursosHTML += `<li>${curso.nombre} - ${estado}</li>`;
  });

  cursosHTML += "</ul>";
  contenido.innerHTML = cursosHTML;
}

function verProgreso() {
  let totalCursos = cursosCertificados.length;
  let aprobados = cursosCertificados.filter(curso => curso.aprobado).length;
  let porcentaje = (aprobados / totalCursos) * 100;

  let contenido = document.getElementById("contenido");
  contenido.innerHTML = `
      <h3>📊 Progreso</h3>
      <p>Has completado ${aprobados} de ${totalCursos} cursos.</p>
      <div class="progress">
          <div class="progress-bar" style="width: ${porcentaje}%">${porcentaje.toFixed(2)}%</div>
      </div>
  `;
}

function imprimirDiploma() {
  alert("📜 Generando diploma...");
  window.open("../certificados/diploma.pdf", "_blank"); // Se mantiene la corrección de ruta
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("rol");
  window.location.href = "index.html"; // Se mantiene la corrección de ruta
}
