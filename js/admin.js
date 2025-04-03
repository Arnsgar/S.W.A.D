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
      <td>${cliente.fechaNacimiento}</td>
      <td>${cliente.correo}</td>
      <td>${cliente.usuario}</td>
      <td>${cliente.empresa}</td>
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
  const nombres = document.getElementById("clienteNombres").value.trim();
  const apellidos = document.getElementById("clienteApellidos").value.trim();
  const tipoDocumento = document.getElementById("tipoDocumento").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const numeroDocumento = document.getElementById("numeroDocumento").value.trim();
  const correo = document.getElementById("clienteCorreo").value.trim();
  const usuario = document.getElementById("clienteUsuario").value.trim();
  const contrasena = document.getElementById("clienteContrasena").value;
  const empresa = document.getElementById("nombreEmpresa").value.trim();
  const mensaje = document.getElementById("clienteMsg");

  // Validar que no exista ya un cliente con el mismo ID o correo o usuario
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
    fechaNacimiento,
    numeroDocumento,
    correo,
    usuario,
    contrasena,
    empresa
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
      <p><strong>Nombres:</strong> ${cliente.nombres}</p>
      <p><strong>Apellidos:</strong> ${cliente.apellidos}</p>
      <p><strong>Documento:</strong> ${cliente.tipoDocumento} ${cliente.numeroDocumento}</p>
      <p><strong>Fecha de Nacimiento:</strong> ${cliente.fechaNacimiento}</p>
      <p><strong>Correo:</strong> ${cliente.correo}</p>
      <p><strong>Usuario:</strong> ${cliente.usuario}</p>
      <p><strong>Empresa:</strong> ${cliente.empresa}</p>
    `;
  } else {
    resultado.innerHTML = "<p>Cliente no encontrado.</p>";
  }
});

// Función para eliminar un cliente por ID
function eliminarCliente(id) {
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarListadoClientes();
}

// Mostrar la lista de clientes al cargar la sección "Listado de Clientes"
document.addEventListener("DOMContentLoaded", function () {
  // Se asume que se mostrará el listado cuando se seleccione la sección correspondiente
  mostrarListadoClientes();
});

// Función para cambiar entre secciones en el panel (para el menú lateral)
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(seccion => {
    seccion.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}
