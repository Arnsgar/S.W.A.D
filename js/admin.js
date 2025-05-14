//Cargar Cliente
document.getElementById("clienteForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const errores = {
    error_nombre_instituto: "",
    error_direccion: "",
    error_telefono: "",
    error_correo: "",
    error_nombre_rector: "",
    error_apellidos: "",
    error_tipo_documento: "",
    error_doc_rector: "",
    error_usuario: "",
    error_contrasena: "",
    error_tipo_codigo: "",
    error_codigo: "",
    error_firma_rector: ""
  }

  //obtener los valores de cada campo
  const nombre_instituto = document.getElementById("nombre_instituto").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const nombre_rector = document.getElementById("nombre_rector").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const tipo_documento = document.getElementById("tipo_documento").value;
  const doc_rector = document.getElementById("doc_rector").value.trim();
  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;
  const tipo_codigo = document.getElementById("tipo_codigo").value;
  const codigo = document.getElementById("codigo").value;
  const firma_rector = document.getElementById("firmaBase64").value;


  //Comprobar errores


  if (nombre_instituto.length > 100) {
    errores.error_nombre_instituto = "El nombre no puede ser mas de 100 caracteres";
  } else if (nombre_instituto === "") {
    errores.error_nombre_instituto = "El nombre del instituto no puede estar vacio";
  }

  const soloTexto = texto => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(texto);
  const esCorreo = correo => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const esTelefono = tel => /^[0-9]{7,15}$/.test(tel);
  const esContraseñaValida = c => /^(?=.*[A-Z])(?=(?:.*\d){3,}).{6,}$/.test(c);

  // Validaciones

  if (!soloTexto(nombre_instituto)) {
    errores.error_nombre_instituto = "Solo debe contener letras";
  }

  if (!esTelefono(telefono)) {
    errores.error_telefono = "Teléfono inválido (7 a 15 dígitos)";
  }

  if (!esCorreo(correo)) {
    errores.error_correo = "Correo no válido";
  }

  if (nombre_rector.length > 100 || !soloTexto(nombre_rector)) {
    errores.error_nombre_rector = "Nombre no válido";
  }

  if (apellidos.length > 100 || !soloTexto(apellidos)) {
    errores.error_apellidos = "Apellidos no válidos";
  }


  if (doc_rector.length > 30 || isNaN(doc_rector)) {
    errores.error_doc_rector = "Documento inválido";
  } else {
    const existe = await verificarDocumento(doc_rector);
    if (existe) errores.error_doc_rector = "Ya existe un documento igual";
  }

  if (usuario.length > 50 || usuario.length < 4) {
    errores.error_usuario = "Usuario muy corto";
  } else {
    const existe = await verificarUsuario(usuario);
    if (existe) errores.error_usuario = "Usuario ya registrado";
  }

  if (!esContraseñaValida(contrasena)) {
    errores.error_contrasena = "La contraseña debe tener al menos 1 mayúscula y 3 números";
  }

  guardarFirma();
  
  if (canvasEstaVacio(canvas)) {
  errores.error_firma_rector = "Por favor, dibuje una firma antes de enviar.";
  firmaImagen.value = ""; // Asegúrate también de limpiar el campo oculto
}

  for (let campo in errores) {
    const divError = document.getElementById(campo);
    if (divError) {
      divError.innerText = errores[campo];
    }
  }
  




  const hayErrores = Object.values(errores).some(mensaje => mensaje !== "");
  console.log(hayErrores);
  if (hayErrores) {
    return; // <-- detener si hay errores
  }

  
  

  const formData = new FormData(document.getElementById("clienteForm"));

  fetch("../backend/admin.php", {
    method: "POST",
    body: formData
  })
    .then(async res => {
      const text = await res.text();
      console.log("Respuesta del servidor (raw):", text);

  try {
    const data = JSON.parse(text);
    if (data.success) {
      alert("Cliente guardado correctamente");
      document.getElementById("clienteForm").reset();
      borrarFirma();
    } else {
      alert("Error al guardar: " + data.message);
    }
  } catch (e) {
    console.error("No se pudo parsear JSON:", e);
    alert("Error inesperado en la respuesta del servidor");
  }
}).catch(error => {
  console.error("Error en la solicitud de servidor o de red:", error);
  alert("Error de conexión o del servidor: " + error.message);
});

});

//verficar  datos unicos de la BD

async function verificarUsuario(usuario) {
  const formData = new FormData();
  formData.append("usuario", usuario);
  formData.append("accion", "verificar_usuario");

  const res = await fetch("../backend/verificar.php", {
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

  const res = await fetch("../backend/verificar.php", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.existe;
}

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


// Función para mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}



// Cargar clientes desde el backend (listar_clientes.php)
function cargarClientes() {
  fetch('../backend/listar_clientes.php')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const tbody = document.querySelector('#clienteTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(cliente => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.numero_documento}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.usuario}</td>
            <td>${cliente.empresa}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          `;
          tbody.appendChild(fila);
        });
      } else {
        alert('Error al cargar clientes: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error al obtener clientes:', error);
    });
}

// Llamar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  cargarClientes();
});



/*




// Función para eliminar un cliente
function eliminarCliente(id) {
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarListadoClientes();
}




// Función para mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

*/