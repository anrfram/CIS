document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initSellCarForm();
  initAuthModal();

  document.querySelector('.close-fuel-modal')?.addEventListener('click', () => {
    document.getElementById('fuel-modal').style.display = 'none';
  });

  console.log('All components initialized');
});

function initAuthModal() {
  console.log('Initializing auth modal...');

  const authButton = document.getElementById('auth-button');
  const authModal = document.getElementById('auth-modal');
  const closeButton = document.querySelector('.close');

  if (!authButton) console.error('Auth button not found!');
  if (!authModal) console.error('Auth modal not found!');
  if (!closeButton) console.error('Close button not found!');

  authButton?.addEventListener('click', () => {
    console.log('Auth button clicked');
    authModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  });

  closeButton?.addEventListener('click', () => {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  window.addEventListener('click', (event) => {
    if (event.target === authModal) {
      authModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToSignin = document.getElementById('switch-to-signin');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');

  if (switchToSignup && signinForm && signupForm) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Switching to signup form');
      signinForm.style.display = 'none';
      signupForm.style.display = 'block';
    });
  } else {
    console.error('Form switching elements not found!');
  }

  if (switchToSignin && signinForm && signupForm) {
    switchToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Switching to signin form');
      signupForm.style.display = 'none';
      signinForm.style.display = 'block';
    });
  }

  const signinFormElement = document.getElementById('signin-form');
  const signupFormElement = document.getElementById('signup-form');

  if (signinFormElement) {
    signinFormElement.addEventListener('submit', handleSignIn);
  } else {
    console.error('Signin form not found!');
  }

  if (signupFormElement) {
    signupFormElement.addEventListener('submit', handleSignUp);
  } else {
    console.error('Signup form not found!');
  }

  checkAuthStatus();
}

function handleSignIn(e) {
  e.preventDefault();
  console.log('Sign in attempt initiated');

  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    console.error('Email or password input not found!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  console.log(`Checking against ${users.length} users`);

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    console.log('User found, signing in:', user.email);
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateNavBar(true);
    document.getElementById('auth-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    alert('Sign in successful!');
  } else {
    console.log('Invalid credentials attempt');
    alert('Invalid email or password.');
  }
}

function handleSignUp(e) {
  e.preventDefault();
  console.log('Sign up attempt initiated');

  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;
  const fullName = document.getElementById('full-name')?.value;

  if (!email || !password || !fullName) {
    console.error('Signup form inputs not found!');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  console.log(`Current user count: ${users.length}`);

  if (users.some(u => u.email === email)) {
    console.log('Duplicate email attempt:', email);
    alert('Email already exists.');
    return;
  }

  const newUser = { email, password, fullName };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  console.log('New user created:', newUser.email);

  updateNavBar(true);
  document.getElementById('auth-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
  alert('Account created successfully!');
}

function checkAuthStatus() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Auth status check:', currentUser ? 'Logged in' : 'Logged out');
    updateNavBar(currentUser !== null);
  } catch (e) {
    console.error('Error checking auth status:', e);
    updateNavBar(false);
  }
}

function updateNavBar(isLoggedIn) {
  console.log(`Updating nav bar, logged in: ${isLoggedIn}`);
  const authButton = document.getElementById('auth-button');
  const accountLink = document.getElementById('account-link');

  if (!authButton || !accountLink) {
    console.error('Nav bar elements not found!');
    return;
  }

  if (isLoggedIn) {
    authButton.style.display = 'none';
    accountLink.style.display = 'block';
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      accountLink.textContent = currentUser?.fullName || 'My Account';
      console.log('Updated nav with user:', currentUser?.email);
    } catch (e) {
      accountLink.textContent = 'My Account';
    }
  } else {
    authButton.style.display = 'block';
    accountLink.style.display = 'none';
  }
}

console.log("Debug mode active");
document.getElementById('auth-button')?.addEventListener('click', function() {
  console.log("Button clicked - basic test");
  document.getElementById('auth-modal').style.display = 'block';
});


