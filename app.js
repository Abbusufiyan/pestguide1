// Global variables
let currentSlide = 0;
let slides = [];
let autoRotateInterval;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Plantix App Loaded');
    
    // Initialize slideshow
    initSlideshow();
    
    // Check login status
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // If logged in, show dashboard, else show welcome
    if (isLoggedIn === 'true') {
        showDashboardPage();
    } else {
        showWelcomePage();
    }
    
    // Setup file input listener
    const fileInput = document.getElementById('leafImage');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Load scan history if available
    loadScanHistory();
});

// ==================== PAGE NAVIGATION ====================

function showWelcomePage() {
    hideAllPages();
    document.getElementById('welcomePage').classList.add('active');
    initSlideshow();
}

function showLoginPage() {
    hideAllPages();
    document.getElementById('loginPage').classList.add('active');
    showLoginForm();
}

function showDashboardPage() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        showAlert('Please login first', 'error');
        showLoginPage();
        return;
    }
    hideAllPages();
    document.getElementById('dashboardPage').classList.add('active');
    loadScanHistory();
}

function showAccountPage() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        showAlert('Please login first', 'error');
        showLoginPage();
        return;
    }
    hideAllPages();
    document.getElementById('accountPage').classList.add('active');
    loadUserProfile();
}

function hideAllPages() {
    const pages = ['welcomePage', 'loginPage', 'dashboardPage', 'accountPage'];
    pages.forEach(page => {
        const element = document.getElementById(page);
        if (element) element.classList.remove('active');
    });
}

// ==================== SLIDESHOW FUNCTIONS ====================

function initSlideshow() {
    slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Clear existing interval
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    
    // Show first slide
    showSlide(0);
    
    // Start auto-rotation
    autoRotateInterval = setInterval(nextSlide, 5000);
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.onclick = () => {
            clearInterval(autoRotateInterval);
            showSlide(index);
            autoRotateInterval = setInterval(nextSlide, 5000);
        };
    });
}

function showSlide(n) {
    slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active-dot'));
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active-dot');
}

function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) currentSlide = 0;
    showSlide(currentSlide);
}

// ==================== AUTHENTICATION FUNCTIONS ====================

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return false;
    }
    
    if (!email.includes('@')) {
        showAlert('Please enter a valid email', 'error');
        return false;
    }
    
    // Save user data
    const userProfile = {
        name: email.split('@')[0],
        location: 'Your Farm Location',
        email: email,
        joinDate: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    
    showAlert('Login successful!', 'success');
    
    setTimeout(() => {
        showDashboardPage();
    }, 1000);
    
    return false;
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const farm = document.getElementById('signupFarm').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !farm || !password) {
        showAlert('Please fill in all fields', 'error');
        return false;
    }
    
    if (password.length < 4) {
        showAlert('Password must be at least 4 characters', 'error');
        return false;
    }
    
    const userProfile = {
        name: name,
        location: farm,
        email: email,
        joinDate: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    
    showAlert('Account created successfully!', 'success');
    
    setTimeout(() => {
        showDashboardPage();
    }, 1000);
    
    return false;
}

function showLoginForm() {
    document.querySelector('.form-container').style.display = 'block';
    document.querySelector('.signup-container').style.display = 'none';
}

function showSignupForm() {
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('.signup-container').style.display = 'block';
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    showAlert('Logged out successfully', 'success');
    setTimeout(() => {
        showWelcomePage();
    }, 1000);
}

function loadUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile) {
        document.getElementById('profileName').textContent = userProfile.name;
        document.getElementById('profileLocation').textContent = userProfile.location;
        document.getElementById('profileEmail').textContent = userProfile.email;
        document.getElementById('profileDate').textContent = userProfile.joinDate;
    }
}

function showSettings() {
    showAlert('Settings feature coming soon!', 'success');
}

// ==================== LEAF ANALYSIS FUNCTIONS ====================

async function analyzeLeaf() {
    const fileInput = document.getElementById('leafImage');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('Please upload a leaf image first', 'error');
        return;
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        showAlert('Please login first', 'error');
        showLoginPage();
        return;
    }
    
    // Show loading state
    const analyzeBtn = event.target;
    const originalText = analyzeBtn.textContent;
    analyzeBtn.textContent = 'Analyzing... 🔄';
    analyzeBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Sample diseases for demo
        const diseases = [
            { name: 'Early Blight', rec: 'Apply copper-based fungicide. Remove infected leaves. Ensure proper air circulation.' },
            { name: 'Powdery Mildew', rec: 'Apply sulfur or neem oil. Increase air circulation. Avoid overhead watering.' },
            { name: 'Leaf Spot', rec: 'Remove affected leaves. Apply appropriate fungicide. Avoid wetting foliage.' },
            { name: 'Healthy Plant', rec: 'Continue regular care. Monitor for any changes. Maintain proper watering schedule.' }
        ];
        
        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        
        // Display results
        document.getElementById('diseaseName').textContent = randomDisease.name;
        document.getElementById('recommendations').textContent = randomDisease.rec;
        document.getElementById('resultSection').style.display = 'block';
        
        // Save to history
        saveScanToHistory({
            disease: randomDisease.name,
            recommendations: randomDisease.rec,
            crop: 'Tomato'
        });
        
        showAlert('Analysis completed!', 'success');
        
    } catch (error) {
        showAlert('Error analyzing image', 'error');
    } finally {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('previewImage');
            const placeholder = document.querySelector('.upload-placeholder');
            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// ==================== SCAN HISTORY FUNCTIONS ====================

function saveScanToHistory(scanData) {
    let history = JSON.parse(localStorage.getItem('scanHistory')) || [];
    
    const newScan = {
        id: Date.now(),
        crop: scanData.crop || 'Tomato',
        disease: scanData.disease,
        healthColor: getHealthColor(scanData.disease),
        watered: Math.random() > 0.5,
        date: new Date().toLocaleDateString()
    };
    
    history.unshift(newScan);
    if (history.length > 10) history.pop();
    
    localStorage.setItem('scanHistory', JSON.stringify(history));
    loadScanHistory();
}

function loadScanHistory() {
    const historyContainer = document.getElementById('scanHistory');
    if (!historyContainer) return;
    
    const history = JSON.parse(localStorage.getItem('scanHistory')) || [];
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<div class="scan-card"><p style="color: #a0aec0; text-align: center; width: 100%;">No scans yet. Upload a leaf photo to get started!</p></div>';
        return;
    }
    
    historyContainer.innerHTML = history.map(scan => `
        <div class="scan-card">
            <div class="scan-info">
                <h4>${escapeHtml(scan.crop)}</h4>
                <p>${escapeHtml(scan.disease)}</p>
                <small>${escapeHtml(scan.date)}</small>
            </div>
            <div class="scan-status">
                <div class="health-indicator ${scan.healthColor}"></div>
                <div class="watered-indicator">
                    💧 ${scan.watered ? 'Watered' : 'Need Water'}
                </div>
            </div>
        </div>
    `).join('');
}

function getHealthColor(disease) {
    if (!disease || disease === 'Healthy Plant') return 'health-good';
    if (disease.includes('Early') || disease.includes('mild')) return 'health-warning';
    return 'health-bad';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== UTILITY FUNCTIONS ====================

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.remove) alertDiv.remove();
    }, 3000);
}

// Make functions globally available
window.showWelcomePage = showWelcomePage;
window.showLoginPage = showLoginPage;
window.showDashboardPage = showDashboardPage;
window.showAccountPage = showAccountPage;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.handleLogout = handleLogout;
window.showSettings = showSettings;
window.analyzeLeaf = analyzeLeaf;