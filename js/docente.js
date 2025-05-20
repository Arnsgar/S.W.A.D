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
  const id_tipodoc = document.getElementById("id_tipodoc").value;
  const num_documento = document.getElementById("num_documento").value;
  const sexo_nacimiento = document.getElementById("sexo_nacimiento").value;
  const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
  const nacionalidad = document.getElementById("nacionalidad").value;
  const departamento = document.getElementById("departamento").value;
  const municipio = document.getElementById("municipio").value;
  const direccion_residencia = document.getElementById("direccion_residencia").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;
  const nivel_estudios = document.getElementById("nivel_estudios").value;
  const institucion_procedencia = document.getElementById("institucion_procedencia").value;
  const año_graduacion = document.getElementById("año_graduacion").value;
  const id_programa = document.getElementById("id_programa").value;

  // Obtener id_docente válido (por defecto 2, que existe en tu base de datos)
  let id_docente = localStorage.getItem("id_docente");
  if (!id_docente) {
    id_docente = 2; // Cambia aquí si tienes otro id válido
    localStorage.setItem("id_docente", id_docente);
  }

  // Enviar datos al backend
  fetch('../backend/registrar_estudiante.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre,
      apellido,
      id_tipodoc,
      num_documento,
      sexo_nacimiento,
      fecha_nacimiento,
      nacionalidad,
      departamento,
      municipio,
      direccion_residencia,
      correo,
      telefono,
      usuario,
      contrasena,
      nivel_estudios,
      institucion_procedencia,
      año_graduacion,
      id_programa,
      id_docente
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Mostrar los datos en la lista solo si el registro fue exitoso
      const lista = document.getElementById("listaEstudiantes");
      const estudiante = document.createElement("div");
      estudiante.className = "alert alert-secondary mt-2";
      estudiante.innerHTML = `<b>${nombre} ${apellido}</b> | Documento: ${num_documento} | Sexo: ${sexo_nacimiento} | Nacimiento: ${fecha_nacimiento} | Nacionalidad: ${nacionalidad} | Departamento: ${departamento} | Municipio: ${municipio} | Dirección: ${direccion_residencia} | Correo: ${correo} | Teléfono: ${telefono} | Usuario: ${usuario} | Nivel: ${nivel_estudios} | Institución: ${institucion_procedencia} | Año: ${año_graduacion} | Programa: ${id_programa}`;
      lista.appendChild(estudiante);
      document.getElementById("formEstudiante").reset();
      alert('Estudiante registrado correctamente');
    } else {
      alert('Error: ' + data.message);
    }
  })
  .catch(err => {
    alert('Error de conexión con el servidor');
  });
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


  // Puedes poner este script al final de tu archivo HTML o en tu archivo JS principal
document.addEventListener('DOMContentLoaded', function() {
  fetch('../backend/obtener_estudiantes.php')
    .then(response => response.json())
    .then(result => {
      const select = document.getElementById('estudiantesDirec');
      select.innerHTML = '<option value="">Seleccione un estudiante</option>';
      if (result.success && Array.isArray(result.data)) {
        result.data.forEach(est => {
          const option = document.createElement('option');
          option.value = est.id_estudiante;
          option.setAttribute('data-id_programa', est.id_programa);
          option.textContent = est.nombre + ' ' + est.apellido + '\u00A0\u00A0\u00A0'+'Programa: ' + est.programa;
          select.appendChild(option);
        });
      } else {
        select.innerHTML = '<option value="">No hay estudiantes</option>';
      }
    })
    .catch(() => {
      const select = document.getElementById('estudiantesDirec');
      select.innerHTML = '<option value="">Error al cargar</option>';
    });


  });

const select = document.getElementById('estudiantesDirec');

select.addEventListener('change', function () {
  const selectedOption = select.options[select.selectedIndex];
  const id_programa = selectedOption.getAttribute('data-id_programa');

  if (id_programa) {
    consultarDirectrices(id_programa); // Llama la función que ya configuraste
  }
});

// mostrar las directrices actuales del estudiante
  function consultarDirectrices(id_programa){

    fetch(`../backend/directrices_actuales.php?   id_programa=${encodeURIComponent(id_programa)}`)
    .then(response => response.json())
    .then(result => {
      const tbody = document.querySelector('#tablaDirectrices tbody');
      tbody.innerHTML = ''; // Limpiar tabla

      if (result.success && Array.isArray(result.data)) {
        result.data.forEach(est => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${est.id_modulo}</td>
            <td>${est.nombre}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" class="text-center">No hay estudiantes disponibles</td>`;
        tbody.appendChild(row);
      }
    })
    .catch(() => {
      const tbody = document.querySelector('#tablaEstudiantes tbody');
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Error al cargar los estudiantes</td></tr>`;
    });



  }