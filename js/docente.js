document.addEventListener("DOMContentLoaded", () => {
  let estudiantes = [];

  const formEstudiante = document.getElementById("formEstudiante");
  const listaEstudiantes = document.getElementById("listaEstudiantes");
  const progresoContainer = document.getElementById("progresoContainer");
  const listaEstudiantesNotas = document.getElementById("listaEstudiantesNotas");

  // -----------------------------
  // Cargar estudiantes desde PHP
  // -----------------------------
  async function cargarEstudiantes() {
    try {
      const res = await fetch("php/listar_estudiantes.php");
      const data = await res.json();
      estudiantes = data;
      renderEstudiantes();
      renderNotas();
    } catch (err) {
      console.error("Error al cargar estudiantes", err);
    }
  }

  // -----------------------------
  // Escuchar clicks de edición
  // -----------------------------
  document.addEventListener("click", function (e) {
    // Editar
    if (e.target && e.target.classList.contains("btn-editar")) {
      const fila = e.target.closest("tr");
      const id = fila.dataset.id;
      const nombre = fila.children[0].textContent;
      const tipoDocumento = fila.children[1].textContent;
      const numeroDocumento = fila.children[2].textContent;
      const fechaNacimiento = fila.children[3].textContent;
      const correo = fila.children[4].textContent;
      const programa = fila.children[5].textContent;

      document.getElementById("nombre_est").value = nombre;
      document.getElementById("tipo_doc").value = tipoDocumento;
      document.getElementById("num_doc").value = numeroDocumento;
      document.getElementById("fecha_nac").value = fechaNacimiento;
      document.getElementById("correo").value = correo;
      document.getElementById("programa").value = programa;

      document.getElementById("form-estudiante").dataset.editandoId = id;
      document.getElementById("form-estudiante").style.display = "block";
    }

    // Eliminar
    if (e.target && e.target.classList.contains("btn-eliminar")) {
      const fila = e.target.closest("tr");
      const id = fila.dataset.id;

      if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
        fetch("php/eliminar_estudiante.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "id=" + encodeURIComponent(id),
        })
        .then(res => res.text())
        .then(data => {
          alert(data);
          cargarEstudiantes(); // Refrescar la lista
        });
      }
    }
  });

  // -----------------------------------------
  // Registrar estudiante (formulario nuevo)
  // -----------------------------------------
  formEstudiante?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      correo: document.getElementById("correo").value,
      curso: document.getElementById("curso")?.value || "",
      paralelo: document.getElementById("paralelo")?.value || ""
    };

    try {
      const res = await fetch("../backend/registrar_estudiante.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success && json.id_estudiante) {
        estudiantes.push({ id: json.id_estudiante, ...data, modulos: [] });
        renderEstudiantes();
        renderNotas();
        formEstudiante.reset();
      } else {
        alert(json.message || "Error al registrar estudiante");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al registrar");
    }
  });

  // -----------------------------------------
  // Renderizar lista de estudiantes
  // -----------------------------------------
  function renderEstudiantes() {
    listaEstudiantes.innerHTML = "";
    if (estudiantes.length === 0) {
      listaEstudiantes.innerHTML = "<p>No hay estudiantes registrados.</p>";
      return;
    }
    const table = document.createElement("table");
    table.className = "table table-bordered table-hover mt-3";
    table.innerHTML = `
      <thead class="table-dark"><tr>
        <th>Nombre</th><th>Correo</th><th>Curso</th><th>Paralelo</th><th>Acciones</th>
      </tr></thead><tbody>
      ${estudiantes.map(est => `
        <tr data-id="${est.id}">
          <td>${est.nombre} ${est.apellido}</td>
          <td>${est.correo}</td>
          <td>${est.curso}</td>
          <td>${est.paralelo}</td>
          <td>
            <button class="btn btn-sm btn-primary btn-editar">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
          </td>
        </tr>`).join("")}
      </tbody>`;
    listaEstudiantes.appendChild(table);
  }

  // -----------------------------------------
  // Mostrar progreso
  // -----------------------------------------
  window.mostrarProgreso = function (id) {
    const est = estudiantes.find(e => e.id === id);
    if (!est) return;
    document.querySelector('[data-section="progresoEstudiantes"]')?.click();
    progresoContainer.innerHTML = `<h4>${est.nombre} ${est.apellido}</h4><p>Progreso cargado desde base de datos.</p>`;
  };

  // -----------------------------------------
  // Renderizar tarjetas de notas
  // -----------------------------------------
  function renderNotas() {
    listaEstudiantesNotas.innerHTML = "";
    if (estudiantes.length === 0) {
      listaEstudiantesNotas.innerHTML = "<p>No hay estudiantes disponibles para notas.</p>";
      return;
    }
    estudiantes.forEach(est => {
      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5>${est.nombre} ${est.apellido}</h5>
            <p class="text-muted">${est.curso} - ${est.paralelo}</p>
          </div>
          <div>
            <button class="btn btn-primary me-2" onclick="editarNotas(${est.id})">
              <i class="fas fa-pen"></i> Editar Notas
            </button>
            <button class="btn btn-warning me-2" onclick="abrirCitacion(${est.id})">
              <i class="fas fa-user-clock"></i> Citar
            </button>
            <button class="btn btn-info" onclick="abrirObservacion(${est.id})">
              <i class="fas fa-comment"></i> Observar
            </button>
          </div>
        </div>`;
      listaEstudiantesNotas.appendChild(card);
    });
  }

  // -----------------------------------------
  // Funciones auxiliares para observación/citación
  // -----------------------------------------
  window.editarNotas = function (id) {
    alert(`Editar notas para estudiante ${id}`);
  };

  window.abrirCitacion = async function (id_estudiante) {
    const motivo = prompt("Motivo de la citación:");
    if (!motivo) return;
    alert(`Citación creada para estudiante ${id_estudiante}`);
  };

  window.abrirObservacion = async function (id_estudiante) {
    const obs = prompt("Observación:");
    if (!obs) return;
    alert(`Observación registrada para estudiante ${id_estudiante}`);
  };

  // -----------------------------------------
  // Navegación entre secciones
  // -----------------------------------------
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-section');
      document.querySelectorAll('.seccion').forEach(sec => sec.classList.add('d-none'));
      document.getElementById(target)?.classList.remove('d-none');
      document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const primera = document.querySelector('.nav-link[data-section]');
  if (primera) {
    primera.classList.add('active');
    document.getElementById(primera.getAttribute('data-section')).classList.remove('d-none');
  }

  cargarEstudiantes(); // Inicial
});
