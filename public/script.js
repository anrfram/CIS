document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initFilters();
  initSellCarForm();
  initAuthModal();

  // Debugging check
  console.log('All components initialized');
});

// Authentication Modal System
function initAuthModal() {
  console.log('Initializing auth modal...'); // Debug log

  // Get all required elements
  const authButton = document.getElementById('auth-button');
  const authModal = document.getElementById('auth-modal');
  const closeButton = document.querySelector('.close');

  // Debug: Check if elements exist
  if (!authButton) console.error('Auth button not found!');
  if (!authModal) console.error('Auth modal not found!');
  if (!closeButton) console.error('Close button not found!');

  // Event listeners for modal
  authButton?.addEventListener('click', () => {
    console.log('Auth button clicked'); // Debug log
    authModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Show sign-in form by default when modal opens
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  });

  closeButton?.addEventListener('click', () => {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  });

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === authModal) {
      authModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Form switching logic - Enhanced with debug logs
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToSignin = document.getElementById('switch-to-signin');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');

  if (switchToSignup && signinForm && signupForm) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Switching to signup form'); // Debug log
      signinForm.style.display = 'none';
      signupForm.style.display = 'block';
    });
  } else {
    console.error('Form switching elements not found!'); // Debug log
  }

  if (switchToSignin && signinForm && signupForm) {
    switchToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Switching to signin form'); // Debug log
      signupForm.style.display = 'none';
      signinForm.style.display = 'block';
    });
  }

  // Form submission handlers with enhanced debugging
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

  // Check for logged in user
  checkAuthStatus();
}

// Sign In Handler with debug logs
function handleSignIn(e) {
  e.preventDefault();
  console.log('Sign in attempt initiated'); // Debug log

  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    console.error('Email or password input not found!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  console.log(`Checking against ${users.length} users`); // Debug log

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    console.log('User found, signing in:', user.email); // Debug log
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateNavBar(true);
    document.getElementById('auth-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    alert('Sign in successful!');
  } else {
    console.log('Invalid credentials attempt'); // Debug log
    alert('Invalid email or password.');
  }
}

// Sign Up Handler with debug logs
function handleSignUp(e) {
  e.preventDefault();
  console.log('Sign up attempt initiated'); // Debug log

  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;
  const fullName = document.getElementById('full-name')?.value;

  if (!email || !password || !fullName) {
    console.error('Signup form inputs not found!');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  console.log(`Current user count: ${users.length}`); // Debug log

  if (users.some(u => u.email === email)) {
    console.log('Duplicate email attempt:', email); // Debug log
    alert('Email already exists.');
    return;
  }

  const newUser = { email, password, fullName };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  console.log('New user created:', newUser.email); // Debug log

  updateNavBar(true);
  document.getElementById('auth-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
  alert('Account created successfully!');
}

// Check Authentication Status with debug
function checkAuthStatus() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Auth status check:', currentUser ? 'Logged in' : 'Logged out'); // Debug log
    updateNavBar(currentUser !== null);
  } catch (e) {
    console.error('Error checking auth status:', e); // Debug log
    updateNavBar(false);
  }
}

// Update Navigation Bar with debug
function updateNavBar(isLoggedIn) {
  console.log(`Updating nav bar, logged in: ${isLoggedIn}`); // Debug log
  const authButton = document.getElementById('auth-button');
  const accountLink = document.getElementById('account-link');

  if (!authButton || !accountLink) {
    console.error('Nav bar elements not found!'); // Debug log
    return;
  }

  if (isLoggedIn) {
    authButton.style.display = 'none';
    accountLink.style.display = 'block';
    // Update with user name if available
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      accountLink.textContent = currentUser?.fullName || 'My Account';
      console.log('Updated nav with user:', currentUser?.email); // Debug log
    } catch (e) {
      accountLink.textContent = 'My Account';
    }
  } else {
    authButton.style.display = 'block';
    accountLink.style.display = 'none';
  }
}

// TEMPORARY DEBUG CODE - CAN BE REMOVED AFTER TESTING
console.log("Debug mode active");
document.getElementById('auth-button')?.addEventListener('click', function() {
  console.log("Button clicked - basic test");
  document.getElementById('auth-modal').style.display = 'block';
}); 


