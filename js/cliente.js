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