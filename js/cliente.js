 function mostrarContenido(seccion) {
      const secciones = ['inicio', 'crear', 'buscar', 'listado', 'otro'];
      secciones.forEach(s => {
        document.getElementById('contenido-' + s).style.display = (s === seccion) ? 'block' : 'none';
      });
      // Opcional: cerrar el menú lateral automáticamente
      var offcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('menuLateral'));
      offcanvas.hide();
    }

//Cargar Cliente

document.getElementById("formCrearProfesor").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Limpiar errores previos
  const errores = {
    error_nombres: "",
    error_apellidos: "",
    error_tipoDoc: "",
    error_numDoc: "",
    error_correo: "",
    error_telefono: "",
    error_usuario: "",
    error_contrasena: "",
    error_firma: ""
  };

  // Obtener valores
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const tipoDoc = document.getElementById("tipoDoc").value;
  const numDoc = document.getElementById("numDoc").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const firmaCanvas = document.getElementById("firmaCanvas");
  const firmaBase64 = document.getElementById("firmaBase64");

  // Validaciones
  const soloTexto = texto => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(texto);
  const esCorreo = correo => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const esTelefono = tel => /^[0-9]{7,15}$/.test(tel);
  const esContraseñaValida = c => /^(?=.*[A-Z])(?=(?:.*\d){3,}).{6,}$/.test(c);

  if (!nombres || !soloTexto(nombres)) {
    errores.error_nombres = "Nombres requeridos y solo letras.";
  }
  if (!apellidos || !soloTexto(apellidos)) {
    errores.error_apellidos = "Apellidos requeridos y solo letras.";
  }
  if (!tipoDoc) {
    errores.error_tipoDoc = "Seleccione tipo de documento.";
  }
  if (!numDoc || isNaN(numDoc) || numDoc.length > 30) {
    errores.error_numDoc = "Número de documento inválido.";
  } else {
    const existe = await verificarDocumento(numDoc);
    if (existe) errores.error_numDoc = "Documento ya registrado.";
  }
  if (!correo || !esCorreo(correo)) {
    errores.error_correo = "Correo no válido.";
  }else{
    const existe = await verificarCorreo(correo);
    if (existe) errores.error_correo = "Correo ya registrado.";
  }
  if (!telefono || !esTelefono(telefono)) {
    errores.error_telefono = "Teléfono inválido (7 a 15 dígitos).";
  }
  if (!usuario || usuario.length < 4 || usuario.length > 50) {
    errores.error_usuario = "Usuario entre 4 y 50 caracteres.";
  } else {
    const existe = await verificarUsuario(usuario);
    if (existe) errores.error_usuario = "Usuario ya registrado.";
  }
  if (!contrasena || !esContraseñaValida(contrasena)) {
    errores.error_contrasena = "Mínimo 1 mayúscula y 3 números.";
  }

  // Firma
  guardarFirma();
  if (canvasEstaVacio(firmaCanvas)) {
    errores.error_firma = "Dibuje una firma antes de enviar.";
    firmaBase64.value = "";
  }

  // Mostrar errores
  for (let campo in errores) {
    const divError = document.getElementById(campo);
    if (divError) {
      divError.innerText = errores[campo];
      divError.style.color = errores[campo] ? "#dc3545" : "";
    }
  }

  // Si hay errores, no enviar
  const hayErrores = Object.values(errores).some(msg => msg !== "");
  if (hayErrores) return;

  // Enviar datos
  const formData = new FormData(document.getElementById("formCrearProfesor"));
  fetch("../backend/profesores.php", {
    method: "POST",
    body: formData
  })
    .then(async res => {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          alert("Profesor creado correctamente");
          document.getElementById("formCrearProfesor").reset();
          borrarFirma();
          cargarProfesores(); // Recargar lista de profesores
        } else {
          alert("Error al guardar: " + data.message);
        }
      } catch (e) {
        alert("Error inesperado en la respuesta del servidor");
      }
    })
    .catch(error => {
      alert("Error de conexión o del servidor: " + error.message);
    });
});

//funciones para validar
async function verificarUsuario(usuario) {
  const formData = new FormData();
  formData.append("usuario", usuario);
  formData.append("accion", "verificar_usuario");

  const res = await fetch("../backend/verificar2.php", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.existe; // true si ya existe
}

async function verificarDocumento(doc) {
  const formData = new FormData();
  formData.append("documento", doc);
  formData.append("accion", "verificar_documento");

  const res = await fetch("../backend/verificar2.php", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.existe;
}

async function verificarCorreo(correo) {
  const formData = new FormData();
  formData.append("correo", correo);
  formData.append("accion", "verificar_correo");

  const res = await fetch("../backend/verificar2.php", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.existe;
}







//firma
//verificar si se dibujo algo en canvas en la firma


function canvasEstaVacio(canvas) {
  const contexto = canvas.getContext('2d');
  const pixeles = contexto.getImageData(0, 0, canvas.width, canvas.height).data;

  for (let i = 3; i < pixeles.length; i += 4) {
    if (pixeles[i] !== 0) {
      return false; // Hay algo dibujado
    }
  }
  return true; // Está vacío
}
// Función para mostrar la sección de firma

const canvas = document.getElementById("firmaCanvas");
const firmaImagen = document.getElementById("firmaBase64");
const ctx = canvas.getContext("2d", { willReadFrequently: true }); // Mejor rendimiento

let dibujando = false;

canvas.addEventListener("mousedown", e => {
  dibujando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", e => {
  if (dibujando) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
  }
});

canvas.addEventListener("mouseup", () => {
  dibujando = false;
 guardarFirma();
});

canvas.addEventListener("mouseleave", () => {
  dibujando = false;
 
});

function borrarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  firmaImagen.value = ""; // limpiar también el valor oculto
}

function guardarFirma() {
  if (!canvasEstaVacio(canvas)) {
    const imagen = canvas.toDataURL("image/png");
    firmaImagen.value = imagen;
  } else {
    firmaImagen.value = ""; // fuerza a vacío si no hay firma válida
  }
}

//listar profesores inscritos


// Función para eliminar un instituto
function eliminarDocente(id) {
  // Confirmación antes de eliminar
   if (!confirm("¿Estás seguro de que deseas eliminar este docente?")) return;

  fetch('../backend/eliminar_profesores.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Docente eliminado correctamente");
        cargarProfesores(); // Recarga la tabla
      } else {
        alert("Error al eliminar: " + data.message);
      }
    })
    .catch(error => {
      alert("Error de conexión o del servidor: " + error.message);
    });

}



// Cargar profesores desde el backend (listar_profesores.php)
function cargarProfesores() {
  fetch('../backend/listar_profesores.php')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const tbody = document.querySelector('#profesorTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(docente => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
  <td>${docente.id}</td>
  <td>${docente.nombres}</td>
  <td>${docente.apellidos}</td>
  <td>${docente.numero_documento}</td>
  <td>${docente.correo}</td>
  <td>${docente.telefono}</td>
  <td>${docente.usuario}</td>

  <td>
    <button class="btn btn-danger btn-sm btn-eliminar-docente" data-id="${docente.id}">
      <i class="bi bi-trash"></i>
    </button>
  </td>
`;
          tbody.appendChild(fila);
        });
      } else {
        alert('Error al cargar docentes: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error al obtener docentes:', error);
    });
}

// Llamar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  cargarProfesores();

  // Delegación de eventos para eliminar docente
  const tbody = document.querySelector('#profesorTable tbody');
  tbody.addEventListener('click', function(e) {
    if (e.target.closest('.btn-eliminar-docente')) {
      const id = e.target.closest('.btn-eliminar-docente').dataset.id;
      eliminarDocente(id);
    }
  });
});
