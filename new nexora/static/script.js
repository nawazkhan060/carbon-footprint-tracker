// Base URL for Flask backend
const API_URL = 'http://localhost:5000';

// Store logged-in user
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Save user to localStorage
function saveUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Clear user on logout
function clearUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

// Register Form
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            document.getElementById('signup-form').reset();
            window.location.href = '/login';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Login Form
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            saveUser(data.user);
            alert(data.message);
            document.getElementById('login-form').reset();
            window.location.href = '/';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Carbon Footprint Form
document.getElementById('carbon-footprint-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert('Please log in');
        window.location.href = '/login';
        return;
    }

    // Calculate footprint (from index.html's calculateFootprint)
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const gas = parseFloat(document.getElementById('gas').value) || 0;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const waste = parseFloat(document.getElementById('waste').value) || 0;
    const footprint = (electricity * 0.5) + (gas * 5) + (distance * 0.2) + (waste * 50);

    try {
        const response = await fetch(`${API_URL}/carbon-footprint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUser.id, footprint })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            document.getElementById('carbon-footprint-form').reset();
            fetchCarbonFootprints();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Fetch and Display Footprints
async function fetchCarbonFootprints() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_URL}/carbon-footprint/${currentUser.id}`);
        const data = await response.json();

        if (response.ok) {
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.innerHTML = '<h3>Your Footprints:</h3>';
                data.footprints.forEach(fp => {
                    resultDiv.innerHTML += `<p>${fp.footprint.toFixed(2)} kg CO2 (Added: ${new Date(fp.created_at).toLocaleString()})</p>`;
                });
            }
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Logout Button
document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearUser();
    alert('Logged out');
    window.location.href = '/login';
});

// Fetch footprints on index.html load
if (window.location.pathname === '/' && currentUser) {
    fetchCarbonFootprints();
}