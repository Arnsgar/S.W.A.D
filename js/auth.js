document.getElementById("loginForm").addEventListener("submit",async function (event) {

  event.preventDefault();

    const formData = new FormData(this);
    const errorMsg = document.getElementById("error-msg");

    try {
        let response = await fetch("../backend/login.php", {
            method: "POST",
            body: formData
        });

        let data = await response.json();

        if (data.success) {
            window.location.href = data.redirect;
        } else {
            errorMsg.innerText = data.message;
        }
    } catch (error) {
        errorMsg.innerText = "Error en el servidor. Inténtalo más tarde.";
    }
});




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

// Función para alternar la visibilidad de la contraseña (accesible globalmente)
function togglePassword() {
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }
}
