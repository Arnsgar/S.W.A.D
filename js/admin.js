//Cargar Cliente
document.getElementById("clienteForm").addEventListener("submit",async function(e){
  e.preventDefault();

  const errores={
    error_nombre_instituto:"",
    error_direccion:"",
    error_telefono:"",
    error_correo:"",
    error_nombre_rector:"",
    error_apellidos:"",
    error_tipo_documento:"",
    error_doc_rector:"",
    error_usuario:"",
    error_contrasena:"",
    error_tipo_codigo:"",
    error_codigo:""
  }
//obtener los valores de cada campo
  const nombre_instituto=document.getElementById("nombre_instituto").value.trim();
  const direccion=document.getElementById("direccion").value.trim();
  const telefono=document.getElementById("telefono").value.trim();
  const correo=document.getElementById("correo").value.trim();
  const nombre_rector=document.getElementById("nombre_rector").value.trim();
  const apellidos=document.getElementById("apellidos").value.trim();
  const tipo_documento=document.getElementById("tipo_documento").value;
  const doc_rector=document.getElementById("doc_rector").value.trim();
  const usuario=document.getElementById("usuario").value;
  const contrasena=document.getElementById("contrasena").value;
  const tipo_codigo=document.getElementById("tipo_codigo").value;
  const codigo=document.getElementById("codigo").value;

//Comprobar errores


  if(nombre_instituto.length>100){
    errores.error_nombre_instituto="El nombre no puede ser mas de 100 caracteres";
  }else if(nombre_instituto===""){
 errores.error_nombre_instituto="El nombre del instituto no puede estar vacio";
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

  if (nombre_rector.length>100 || !soloTexto(nombre_rector)) {
    errores.error_nombre_rector = "Nombre no válido";
  }

  if (apellidos.length>100 || !soloTexto(apellidos)) {
    errores.error_apellidos = "Apellidos no válidos";
  }


  if (doc_rector.length>30 || isNaN(doc_rector)) {
    errores.error_doc_rector = "Documento inválido";
  } else {
    const existe = await verificarDocumento(doc_rector);
    if (existe) errores.error_doc_rector = "Ya existe un documento igual";
  }

  if (usuario.length >50 || usuario.length < 4) {
    errores.error_usuario = "Usuario muy corto";
  } else {
    const existe = await verificarUsuario(usuario);
    if (existe) errores.error_usuario = "Usuario ya registrado";
  }

  if (!esContraseñaValida(contrasena)) {
    errores.error_contrasena = "La contraseña debe tener al menos 1 mayúscula y 3 números";
  }

   for (let campo in errores) {
    const divError = document.getElementById(campo);
    if (divError) {
      divError.innerText = errores[campo];
    }
  }


const hayErrores = Object.values(errores).some(mensaje => mensaje !== "");
console.log(hayErrores);
if (!hayErrores) {
  const formData = new FormData(document.getElementById("clienteForm"));

  fetch("../backend/admin.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Cliente guardado correctamente");
      document.getElementById("clienteForm").reset();
    } else {
      alert("Error al guardar: " + data.message);
    }
  })
  .catch(err => {
    console.error("Error en la solicitud:", err);
    alert("Error inesperado.");
  });
}




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




// Función para mostrar la sección de firma

const canvas = document.getElementById("firmaCanvas");
const firmaImagen = document.getElementById("firmaImagen");
const ctx = canvas.getContext("2d");

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
  //guardarFirma();
});

canvas.addEventListener("mouseleave", () => {
  dibujando = false;
 // guardarFirma();
});

function borrarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  firmaImagen.value = ""; // limpiar también el valor oculto
}

function guardarFirma() {
  const imagen = canvas.toDataURL("image/png");
  firmaImagen.value = imagen;
}


// Función para mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}






/*





let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let nextClienteId = localStorage.getItem("nextClienteId") ? parseInt(localStorage.getItem("nextClienteId")) : 1;

// Función para mostrar el listado de clientes
function mostrarListadoClientes() {
  const tbody = document.getElementById("clienteTable").querySelector("tbody");
  tbody.innerHTML = "";
  clientes.forEach(cliente => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nombres}</td>
      <td>${cliente.apellidos}</td>
      <td>${cliente.tipoDocumento} ${cliente.numeroDocumento}</td>
      <td>${cliente.correo}</td>
      <td>${cliente.usuario}</td>
      <td>${cliente.empresa}</td>
      <td>${cliente.firma}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Función para crear un nuevo cliente
document.getElementById("clienteForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const nombres = document.getElementById("nombre_rector").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const tipoDocumento = document.getElementById("tipo_documento").value;
  const numeroDocumento = document.getElementById("doc_rector").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const empresa = document.getElementById("nombre_instituto").value.trim();
  const firma = document.getElementById("firma_rector").value.trim();
  const mensaje = document.getElementById("clienteMsg");

  // Validación de duplicados
  if (clientes.some(c => c.correo === correo || c.usuario === usuario)) {
    mensaje.innerText = "El cliente ya existe.";
    mensaje.style.color = "red";
    return;
  }

  const nuevoCliente = {
    id: nextClienteId++,
    nombres,
    apellidos,
    tipoDocumento,
    numeroDocumento,
    correo,
    usuario,
    contrasena,
    empresa,
    firma
  };

  clientes.push(nuevoCliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("nextClienteId", nextClienteId);
  mensaje.innerText = "Cliente creado exitosamente.";
  mensaje.style.color = "green";
  document.getElementById("clienteForm").reset();
  mostrarListadoClientes();
});

// Función para buscar un cliente por ID
document.getElementById("buscarForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const idBusqueda = parseInt(document.getElementById("buscarId").value);
  const resultado = document.getElementById("resultadoBusqueda");
  const cliente = clientes.find(c => c.id === idBusqueda);

  if (cliente) {
    resultado.innerHTML = `
      <p><strong>ID:</strong> ${cliente.id}</p>
      <p><strong>Nombre:</strong> ${cliente.nombres} ${cliente.apellidos}</p>
      <p><strong>Documento:</strong> ${cliente.tipoDocumento} ${cliente.numeroDocumento}</p>
      <p><strong>Correo:</strong> ${cliente.correo}</p>
      <p><strong>Usuario:</strong> ${cliente.usuario}</p>
      <p><strong>Institución:</strong> ${cliente.empresa}</p>
      <p><strong>Firma:</strong> ${cliente.firma}</p>
    `;
  } else {
    resultado.innerHTML = "<p>Cliente no encontrado.</p>";
  }
});

// Función para eliminar un cliente
function eliminarCliente(id) {
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarListadoClientes();
}

// Mostrar la lista de clientes al cargar
document.addEventListener("DOMContentLoaded", function () {
  mostrarListadoClientes();
});

// Función para mostrar la sección de firma

const canvas = document.getElementById("firmaCanvas");
const firmaImagen = document.getElementById("firmaImagen");
const ctx = canvas.getContext("2d");

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
  guardarFirma();
});

function borrarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  firmaImagen.value = ""; // limpiar también el valor oculto
}

function guardarFirma() {
  const imagen = canvas.toDataURL("image/png");
  firmaImagen.value = imagen;
}


// Función para mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

*/