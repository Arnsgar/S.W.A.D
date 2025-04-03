// Obtener intentos y tiempo de bloqueo desde localStorage
let intentos = localStorage.getItem("intentos") ? parseInt(localStorage.getItem("intentos")) : 0;
let bloqueoHasta = localStorage.getItem("bloqueoHasta") ? parseInt(localStorage.getItem("bloqueoHasta")) : null;

// Verificar si el usuario está bloqueado al cargar la página
if (bloqueoHasta && new Date().getTime() < bloqueoHasta) {
  bloquearUsuario();
}

// Función para bloquear al usuario
function bloquearUsuario() {
  let tiempoActual = new Date().getTime();
  let tiempoRestante = bloqueoHasta ? bloqueoHasta - tiempoActual : 600000; // 10 minutos

  // Si no se ha establecido un tiempo de bloqueo, calcularlo
  if (!bloqueoHasta || tiempoActual >= bloqueoHasta) {
    bloqueoHasta = tiempoActual + 600000;
    localStorage.setItem("bloqueoHasta", bloqueoHasta);
  }

  // Deshabilitar los campos del formulario
  document.getElementById("usuario").disabled = true;
  document.getElementById("password").disabled = true;
  document.getElementById("tipoUsuario").disabled = true;
  document.getElementById("noRobot").disabled = true;
  document.getElementById("error-msg").innerText = "Usuario bloqueado por 10 minutos.";

  // Esperar hasta el tiempo de desbloqueo y restaurar los campos
  setTimeout(() => {
    localStorage.removeItem("intentos");
    localStorage.removeItem("bloqueoHasta");
    document.getElementById("usuario").disabled = false;
    document.getElementById("password").disabled = false;
    document.getElementById("tipoUsuario").disabled = false;
    document.getElementById("noRobot").disabled = false;
    document.getElementById("error-msg").innerText = "";
  }, tiempoRestante);
}

// Agregar listener al formulario de login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Elementos del formulario
    const noRobotCheckbox = document.getElementById("noRobot");
    const errorMsg = document.getElementById("error-msg");
    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("password");
    const tipoUsuarioSelect = document.getElementById("tipoUsuario");

    // Verificar checkbox "No soy un robot"
    if (!noRobotCheckbox.checked) {
      errorMsg.innerText = "Verifica que no eres un robot.";
      return;
    }

    // Obtener valores del formulario
    let usuario = usuarioInput.value.trim().toLowerCase();
    let contraseña = passwordInput.value;
    let tipoUsuario = tipoUsuarioSelect.value;

    // Usuarios de prueba (puedes reemplazar esto con una consulta a la base de datos)
    const usuarios = {
      admin: {usuario:"Admin", contraseña: "Admin123*", rol: "admin", redirect: "admin.html" },
      usuario: { contraseña: "User123*", rol: "cliente", redirect: "cliente.html" },
      docente: { contraseña: "docente123", rol: "docente", redirect: "docentes.html" },
      estudiante: { contraseña: "estudiante123", rol: "estudiante", redirect: "estudiantes.html" }
    };

    // Validar credenciales
    if ( usuarios[usuario].contraseña === contraseña && tipoUsuario === usuarios[usuario].rol) {
      localStorage.setItem("user", usuario);
      localStorage.setItem("rol", tipoUsuario);
      localStorage.removeItem("intentos"); // Reiniciar intentos fallidos
      window.location.href = usuarios[usuario].redirect;
    } else {
      intentos++;
      localStorage.setItem("intentos", intentos);
      errorMsg.innerText = "Usuario o contraseña incorrectos.";

      // Bloqueo tras 10 intentos fallidos
      if (intentos >= 10) {
        bloquearUsuario();
      }
    }
  });
}

// Evento para "Olvidé mi contraseña"
const forgotPasswordLink = document.getElementById("forgotPassword");
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();
    const email = prompt("Ingresa tu correo electrónico registrado:");
    if (email) {
      // Enviar solicitud para restablecer la contraseña
      fetch("../php/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert("Se ha enviado una nueva contraseña a tu correo electrónico.");
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch(error => {
          console.error("Error en la recuperación de contraseña:", error);
        });
    }
  });
}

// Función para cerrar sesión (accesible globalmente)
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("rol");
  window.location.href = "index.html";
}

// Función para alternar la visibilidad de la contraseña (accesible globalmente)
function togglePassword() {
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }
}
