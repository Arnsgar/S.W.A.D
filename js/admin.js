// Simulación de base de datos para clientes
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
