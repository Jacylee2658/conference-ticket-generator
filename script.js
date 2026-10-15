/* =========================================================
   1. ELEMENT REFERENCES
   ========================================================= */
const form         = document.querySelector('.ticket-form');
const ticket       = document.getElementById('ticket');
const heroSection  = document.querySelector('.hero-section');

const inputFile    = document.querySelector('.file-input');
const filePicker   = document.querySelector('.img-picker');
const textDrop     = document.querySelector('.dropText');
const btnFlex      = document.querySelector('.btnFlex');
const btnRemove    = document.querySelector('.removeBtn');
const btnChange    = document.querySelector('.changeBtn');
const errorText    = document.querySelector('.helper-text');
const uploadBox    = document.querySelector('.upload-box');

const fullnameInput = document.getElementById('fullname');
const emailInput    = document.getElementById('email');
const githubInput   = document.getElementById('github');

const ticketAvatar   = document.getElementById('ticketAvatar');
const ticketName     = document.getElementById('ticketName');
const ticketEmail    = document.getElementById('ticketEmail');
const ticketCardName = document.getElementById('ticketCardName');
const ticketGithub   = document.getElementById('ticketGithub');
const ticketNumber   = document.getElementById('ticketNumber');

/* Constants */
const MAX_FILE_SIZE = 500 * 1024; // 500 KB
const DEFAULT_HELPER_HTML =
  '<img src="assets/images/icon-info.svg" alt=""> Upload your photo (JPG or PNG, max size: 500KB).';
const DEFAULT_ICON_SRC = 'assets/images/icon-upload.svg';

/* Simple email regex — good enough for a demo */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* =========================================================
   2. HELPERS — upload box
   ========================================================= */
function resetHelperText() {
  errorText.innerHTML = DEFAULT_HELPER_HTML;
  errorText.style.color = '';
}

function showError(message) {
  errorText.innerHTML = message;
  errorText.style.color = 'hsl(7, 88%, 70%)';
}

function showPreview(file) {
  filePicker.src = URL.createObjectURL(file);
  textDrop.style.display = 'none';
  btnFlex.style.display = 'flex';
}

function resetUploadBox() {
  inputFile.value = '';
  filePicker.src = DEFAULT_ICON_SRC;
  textDrop.style.display = '';
  btnFlex.style.display = 'none';
  resetHelperText();
}


/* =========================================================
   3. VALIDATION
   ========================================================= */

// Show/clear an error under a specific field
function setFieldError(inputEl, errorEl, message) {
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    inputEl.classList.add('input-error');
  } else {
    errorEl.textContent = '';
    errorEl.hidden = true;
    inputEl.classList.remove('input-error');
  }
}

// Show/clear the upload box error
function setAvatarError(message) {
  const errorEl = document.getElementById('avatarError');
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    uploadBox.classList.add('upload-error');
  } else {
    errorEl.textContent = '';
    errorEl.hidden = true;
    uploadBox.classList.remove('upload-error');
  }
}

// Validators — each returns '' if valid, or an error message
function validateFullname(value) {
  if (!value) return 'Please enter your full name';
  return '';
}

function validateEmail(value) {
  if (!value) return 'Please enter your email';
  if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
  return '';
}

function validateGithub(value) {
  if (!value) return 'Please enter your GitHub username';
  return '';
}

function validateAvatar(file) {
  if (!file) return 'Please upload an avatar';
  if (file.size > MAX_FILE_SIZE) return 'File too large. Max size is 500KB';
  return '';
}

// Check if Github username exists
async function confirmGitHubUsername(name){
  const response = await fetch(`https://api.github.com/users/${name}`)
  if(!response.ok){
    setFieldError(githubInput,   document.getElementById('githubError'),  'Invalid GitHub Username');
  }else {
    const data = await response.json()
    console.log(data)
    alert("Yaaay!!")
    return true
  }
}

// Run all validators and show errors. Returns true if valid.
function validateForm(file) {
  const errors = {
    fullname: validateFullname(fullnameInput.value.trim()),
    email:    validateEmail(emailInput.value.trim()),
    github:  validateGithub(githubInput.value.trim()),
    avatar:   validateAvatar(file),
  };

  setFieldError(fullnameInput, document.getElementById('fullnameError'), errors.fullname);
  setFieldError(emailInput,    document.getElementById('emailError'),    errors.email);
  setFieldError(githubInput,   document.getElementById('githubError'),   errors.github);
  setAvatarError(errors.avatar);

  // Any message that isn't '' means there's an error
  return Object.values(errors).every(msg => msg === '');
}

// Clear a field's error as soon as the user types in it
function attachLiveClear(inputEl, errorEl) {
  inputEl.addEventListener('input', () => {
    if (inputEl.value.trim() !== '') {
      setFieldError(inputEl, errorEl, '');
    }
  });
}

attachLiveClear(fullnameInput, document.getElementById('fullnameError'));
attachLiveClear(emailInput,    document.getElementById('emailError'));
attachLiveClear(githubInput,   document.getElementById('githubError'));


/* =========================================================
   4. FILE INPUT
   ========================================================= */
inputFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  resetHelperText();

  if (file.size > MAX_FILE_SIZE) {
    showError('File too large. Please make it under 500KB.');
    inputFile.value = '';
    return;
  }

  showPreview(file);
  setAvatarError('');   // clear error once a valid file is picked
});


/* =========================================================
   5. REMOVE / CHANGE BUTTONS
   ========================================================= */
btnRemove.addEventListener('click', () => {
  resetUploadBox();
});

btnChange.addEventListener('click', () => {
  inputFile.click();
});


/* =========================================================
   6. FORM SUBMIT
   ========================================================= */

async function name(params) {
  
}
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fullname = fullnameInput.value.trim();
  const email    = emailInput.value.trim();
  const github   = githubInput.value.trim();
  const file     = inputFile.files[0];

  // 6a. Validate — stop if anything is wrong
  if (!validateForm(file)) {
    // focus the first field with an error
    const firstError = document.querySelector('.input-error, .upload-error');
    if (firstError) firstError.focus?.();
    return;
  }

  // 6b. Fill the ticket
  const firstName = fullname.split(' ')[0] || 'Guest';
  ticketName.textContent     = firstName;
  ticketEmail.textContent    = email;
  ticketCardName.textContent = fullname;
  ticketGithub.textContent   = github.startsWith('@') ? github : '@' + github;
  ticketNumber.textContent   = '#' + Math.floor(10000 + Math.random() * 90000);

  if (file) {
    ticketAvatar.src = URL.createObjectURL(file);
  }

  // 6c. Swap screens
  form.hidden = true;
  heroSection.hidden = true;
  ticket.hidden = false;

  window.scrollTo({ top: 0, behavior: 'smooth' });
});




const string ='jude'
console.log(string.slice(1,string.length))