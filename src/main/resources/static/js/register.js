// Carrusel dinámico de imágenes
const images = document.querySelectorAll('.carousel-dinamico img');
const captions = ["Anime", "Videojuegos", "Libros", "Series"];
const caption = document.getElementById('carousel-caption');
let current = 0;
setInterval(() => {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
    caption.textContent = captions[current];
}, 2600);

// Mostrar/ocultar contraseña
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = document.getElementById(`eye-icon-${fieldId === 'confirmPassword' ? 'confirm' : 'password'}`);
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
    } else {
        passwordField.type = 'password';
        eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
    }
}

// Validación dinámica de formulario
const form = document.getElementById('registerForm');
const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const terms = document.getElementById('terms');
const registerBtn = document.getElementById('registerBtn');

// Función para validar fortaleza de contraseña
function checkPasswordStrength(password) {
    let strength = 0;
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const percentage = (strength / 5) * 100;
    strengthFill.style.width = percentage + '%';
    
    if (strength < 2) {
        strengthFill.className = 'strength-fill weak';
        strengthText.textContent = 'Débil';
    } else if (strength < 4) {
        strengthFill.className = 'strength-fill medium';
        strengthText.textContent = 'Media';
    } else {
        strengthFill.className = 'strength-fill strong';
        strengthText.textContent = 'Fuerte';
    }
    
    return strength >= 2;
}

// Validaciones en tiempo real
nombre.addEventListener('input', function() {
    const feedback = document.getElementById('nombre-feedback');
    if (this.value.length < 3) {
        feedback.textContent = 'El nombre debe tener al menos 3 caracteres';
        feedback.className = 'input-feedback error';
    } else if (this.value.length > 20) {
        feedback.textContent = 'El nombre no puede tener más de 20 caracteres';
        feedback.className = 'input-feedback error';
    } else {
        feedback.textContent = '✓ Nombre válido';
        feedback.className = 'input-feedback success';
    }
    validateForm();
});

email.addEventListener('input', function() {
    const feedback = document.getElementById('email-feedback');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
        feedback.textContent = 'Ingresa un correo válido';
        feedback.className = 'input-feedback error';
    } else {
        feedback.textContent = '✓ Correo válido';
        feedback.className = 'input-feedback success';
    }
    validateForm();
});

password.addEventListener('input', function() {
    const feedback = document.getElementById('password-feedback');
    const isStrong = checkPasswordStrength(this.value);
    
    if (this.value.length < 6) {
        feedback.textContent = 'La contraseña debe tener al menos 6 caracteres';
        feedback.className = 'input-feedback error';
    } else if (!isStrong) {
        feedback.textContent = 'Usa mayúsculas, minúsculas, números y símbolos';
        feedback.className = 'input-feedback warning';
    } else {
        feedback.textContent = '✓ Contraseña segura';
        feedback.className = 'input-feedback success';
    }
    
    // Revalidar confirmación de contraseña
    if (confirmPassword.value) {
        confirmPassword.dispatchEvent(new Event('input'));
    }
    validateForm();
});

confirmPassword.addEventListener('input', function() {
    const feedback = document.getElementById('confirm-feedback');
    if (this.value !== password.value) {
        feedback.textContent = 'Las contraseñas no coinciden';
        feedback.className = 'input-feedback error';
    } else if (this.value.length === 0) {
        feedback.textContent = '';
        feedback.className = 'input-feedback';
    } else {
        feedback.textContent = '✓ Las contraseñas coinciden';
        feedback.className = 'input-feedback success';
    }
    validateForm();
});

terms.addEventListener('change', validateForm);

function validateForm() {
    const isNameValid = nombre.value.length >= 3 && nombre.value.length <= 20;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    const isPasswordValid = password.value.length >= 6 && checkPasswordStrength(password.value);
    const isConfirmValid = confirmPassword.value === password.value && confirmPassword.value.length > 0;
    const isTermsAccepted = terms.checked;
    
    registerBtn.disabled = !(isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isTermsAccepted);
}

// Envío del formulario con loading
form.addEventListener('submit', function(e) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    registerBtn.disabled = true;
});

// Modal de términos y condiciones
function showTerms() {
    document.getElementById('termsModal').style.display = 'block';
}

function closeTerms() {
    document.getElementById('termsModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('termsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}