document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initFilters();
  initSellCarForm();
  initAuthModal();

  // Initialize fuel modal close button
  document.querySelector('.close-fuel-modal')?.addEventListener('click', () => {
    document.getElementById('fuel-modal').style.display = 'none';
  });

  // Debugging check
  console.log('All components initialized');
});

// Authentication Modal System
function initAuthModal() {
  console.log('Initializing auth modal...');

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
    console.log('Auth button clicked');
    authModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Show sign-in form by default when modal opens
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  });

  closeButton?.addEventListener('click', () => {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
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

// Sign Up Handler with debug logs
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

// Check Authentication Status with debug
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

// Update Navigation Bar with debug
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
    // Update with user name if available
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

// TEMPORARY DEBUG CODE - CAN BE REMOVED AFTER TESTING
console.log("Debug mode active");
document.getElementById('auth-button')?.addEventListener('click', function() {
  console.log("Button clicked - basic test");
  document.getElementById('auth-modal').style.display = 'block';
});
// Improved Fuel Economy API Functions
async function fetchFuelData(make, model, year) {
  try {
    // First try the detailed endpoint
    const searchUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) throw new Error('Network response was not ok');

    const searchData = await searchResponse.json();

    // Check if we got valid menu items
    if (!searchData.menuItem || !Array.isArray(searchData.menuItem) {
      // Fall back to the basic search if detailed search fails
      return await fetchBasicFuelData(make, model, year);
    }

    if (searchData.menuItem.length === 0) {
      return await fetchBasicFuelData(make, model, year);
    }

    // Get the first vehicle ID from the results
    const vehicleId = searchData.menuItem[0].value;

    // Fetch detailed vehicle information
    const vehicleUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/${vehicleId}`;
    const vehicleResponse = await fetch(vehicleUrl);
    if (!vehicleResponse.ok) throw new Error('Network response was not ok');

    const vehicleData = await vehicleResponse.json();

    // Validate we got the expected data
    if (!vehicleData || !vehicleData.city08) {
      return await fetchBasicFuelData(make, model, year);
    }

    return [vehicleData];
  } catch (error) {
    console.error('Error in fetchFuelData:', error);
    // Try the basic search as fallback
    return await fetchBasicFuelData(make, model, year);
  }
}

// Fallback basic fuel data search
async function fetchBasicFuelData(make, model, year) {
  try {
    const basicUrl = `https://www.fueleconomy.gov/ws/rest/vehicles?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;

    const response = await fetch(basicUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    // The basic endpoint returns vehicles directly (not as menu items)
    if (data && data.vehicle && Array.isArray(data.vehicle)) {
      return data.vehicle;
    }

    return null;
  } catch (error) {
    console.error('Error in fetchBasicFuelData:', error);
    return null;
  }
}

function showFuelEconomy(make, model, year) {
  const fuelModal = document.getElementById('fuel-modal');
  const fuelContent = document.getElementById('fuel-info-content');

  // Show loading state
  fuelContent.innerHTML = `
    <div class="fuel-loading">
      <i class="fas fa-spinner fa-spin"></i> Loading fuel data for ${year} ${make} ${model}...
    </div>
  `;

  // Show the modal
  fuelModal.style.display = 'block';

  // Fetch fuel data with retry logic
  fetchFuelData(make, model, year)
    .then(data => {
      if (data && data.length > 0) {
        // Find the most relevant vehicle (first one in the array)
        const vehicle = data[0];

        // Format the fuel information
        fuelContent.innerHTML = `
          <div class="fuel-info">
            <h4>${year} ${make} ${model}</h4>
            <div class="fuel-stats">
              <div class="fuel-stat">
                <div class="fuel-stat-label">City MPG</div>
                <div class="fuel-stat-value">${vehicle.city08 || 'N/A'} MPG</div>
              </div>
              <div class="fuel-stat">
                <div class="fuel-stat-label">Highway MPG</div>
                <div class="fuel-stat-value">${vehicle.highway08 || 'N/A'} MPG</div>
              </div>
              <div class="fuel-stat">
                <div class="fuel-stat-label">Combined MPG</div>
                <div class="fuel-stat-value">${vehicle.comb08 || 'N/A'} MPG</div>
              </div>
              ${vehicle.fuelType1 ? `
              <div class="fuel-stat">
                <div class="fuel-stat-label">Fuel Type</div>
                <div class="fuel-stat-value">${vehicle.fuelType1}</div>
              </div>
              ` : ''}
              ${vehicle.fuelCost08 ? `
              <div class="fuel-stat">
                <div class="fuel-stat-label">Annual Fuel Cost</div>
                <div class="fuel-stat-value">$${vehicle.fuelCost08}</div>
              </div>
              ` : ''}
              ${vehicle.co2TailpipeGpm ? `
              <div class="fuel-stat">
                <div class="fuel-stat-label">CO2 Emissions</div>
                <div class="fuel-stat-value">${vehicle.co2TailpipeGpm} g/mi</div>
              </div>
              ` : ''}
            </div>
            <p style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
              Data provided by <a href="https://www.fueleconomy.gov" target="_blank">fueleconomy.gov</a>
            </p>
          </div>
        `;
      } else {
        // Show more helpful message when no data is found
        fuelContent.innerHTML = `
          <div class="fuel-error">
            <i class="fas fa-exclamation-triangle"></i> 
            <p>No detailed fuel economy data found for ${year} ${make} ${model}.</p>
            <p>This could be because:</p>
            <ul>
              <li>The vehicle is very new or very old</li>
              <li>It's a rare or limited edition model</li>
              <li>There was a temporary issue with the data source</li>
            </ul>
            <p>Try searching directly on <a href="https://www.fueleconomy.gov" target="_blank">fueleconomy.gov</a></p>
          </div>
        `;
      }
    })
    .catch(error => {
      console.error('Error fetching fuel data:', error);
      fuelContent.innerHTML = `
        <div class="fuel-error">
          <i class="fas fa-exclamation-triangle"></i> 
          <p>We couldn't connect to the fuel economy database.</p>
          <p>This might be because:</p>
          <ul>
            <li>You're offline or have connection issues</li>
            <li>The fuel economy service is temporarily down</li>
          </ul>
          <p>Please try again later or visit <a href="https://www.fueleconomy.gov" target="_blank">fueleconomy.gov</a> directly.</p>
        </div>
      `;
    });
}

// Make the function available globally
window.showFuelEconomy = showFuelEconomy;