// ========================================
// STATE MANAGEMENT
// ========================================
let selectedNetwork = null;
let selectedPlan = null;
let balanceVisible = true;
let walletBalance = 0.00;

// ========================================
// NOTIFICATION SYSTEM
// ========================================
let notifications = [
    {
        id: 1,
        icon: '💸',
        title: 'Welcome to Plutiply!',
        message: 'Your Reliable Digital Transaction Partner',
        time: 'now',
        read: false,
        type: 'info'
    }
];

// ========================================
// DATA PLANS CONFIGURATION
// ========================================
const dataPlans = {
    'MTN': [
        { size: '1GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '2GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '3GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '4GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '5GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '6GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '8GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '10GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '15GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '20GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '25GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '30GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '40GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '50GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '100GB', validity: 'Non-Expiry', price: 0.00 },
    ],
    'AirtelTigo': [
        { size: '1GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '2GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '3GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '4GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '5GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '6GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '7GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '8GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '10GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '15GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '20GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '25GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '30GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '40GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '50GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '100GB', validity: 'Non-Expiry', price: 0.00 },
    ],
    'Glo': [
        { size: '200MB', validity: 'Non-Expiry', price: 0.00 },
        { size: '500MB', validity: 'Non-Expiry', price: 0.00 },
        { size: '1GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '2.5GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '5GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '8GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '12GB', validity: 'Non-Expiry', price: 0.00 },
    ],
    'Telecel': [
        { size: '1GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '10GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '15GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '20GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '25GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '30GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '40GB', validity: 'Non-Expiry', price: 0.00 },
        { size: '50GB', validity: 'Non-Expiry', price: 0.00 },
    ]
};

// ========================================
// ALERT SYSTEM
// ========================================
function showAlert(message, type = 'info', duration = 5000) {
    const container = document.getElementById('alertContainer');
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    
    // Set alert content based on type
    const typeLabels = {
        'success': 'Success',
        'error': 'Error',
        'warning': 'Warning',
        'info': 'Info'
    };
    
    alert.innerHTML = `
        <strong>${typeLabels[type]}!</strong> ${message}
        <button class="closebtn">&times;</button>
    `;
    
    // Add to container
    container.appendChild(alert);
    
    // Close button functionality
    const closeBtn = alert.querySelector('.closebtn');
    closeBtn.onclick = function() {
        closeAlert(alert);
    };
    
    // Auto-remove after duration (if duration > 0)
    if (duration > 0) {
        setTimeout(() => {
            closeAlert(alert);
        }, duration);
    }
}

function closeAlert(alertElement) {
    alertElement.style.opacity = '0';
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 600);
}

// ========================================
// NETWORK SELECTION
// ========================================
function selectNetwork(network) {
    selectedNetwork = network;
    
    // Update UI - highlight selected network
    document.querySelectorAll('.network-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.network-card').classList.add('selected');
    
    // Load data plans for selected network
    loadDataPlans(network);
    
    // Show data plans section
    const dataPlansSection = document.getElementById('dataPlansSection');
    dataPlansSection.classList.add('active');
    
    // Update summary
    document.getElementById('summaryNetwork').textContent = network;
    
    // Reset plan selection
    resetPlanSelection();
    
    // Hide purchase form
    document.getElementById('purchaseForm').classList.remove('active');
    
    // Show success alert
    showAlert(`${network} network selected successfully`, 'success', 3000);
}

// ========================================
// DATA PLANS MANAGEMENT
// ========================================
function loadDataPlans(network) {
    const plansGrid = document.getElementById('plansGrid');
    plansGrid.innerHTML = '';
    
    const plans = dataPlans[network];
    
    if (!plans || plans.length === 0) {
        plansGrid.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">No plans available</p>';
        return;
    }
    
    plans.forEach((plan, index) => {
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        planCard.onclick = () => selectPlan(plan, planCard);
        
        planCard.innerHTML = `
            <div class="plan-size">${plan.size}</div>
            <div class="plan-validity">${plan.validity}</div>
            <div class="plan-price">₵${plan.price.toFixed(2)}</div>
        `;
        
        plansGrid.appendChild(planCard);
    });
}

function selectPlan(plan, element) {
    selectedPlan = plan;
    
    // Update UI - highlight selected plan
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Update summary
    updatePurchaseSummary();
    
    // Show purchase form
    document.getElementById('purchaseForm').classList.add('active');
    
    // Scroll to form smoothly
    setTimeout(() => {
        document.getElementById('purchaseForm').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 100);
    
    // Show info alert
    showAlert(`${plan.size} data plan selected`, 'info', 3000);
}

function resetPlanSelection() {
    selectedPlan = null;
    document.getElementById('summaryPlan').textContent = '-';
    document.getElementById('summaryValidity').textContent = '-';
    document.getElementById('summaryTotal').textContent = '₵0.00';
    
    // Remove selected class from all plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// ========================================
// PURCHASE SUMMARY UPDATES
// ========================================
function updatePurchaseSummary() {
    if (selectedPlan) {
        document.getElementById('summaryPlan').textContent = selectedPlan.size;
        document.getElementById('summaryValidity').textContent = selectedPlan.validity;
        document.getElementById('summaryTotal').textContent = `₵${selectedPlan.price.toFixed(2)}`;
    }
}

// Update phone number in summary in real-time
document.getElementById('phoneNumber').addEventListener('input', function(e) {
    const phone = e.target.value;
    document.getElementById('summaryPhone').textContent = phone || '-';
});

// ========================================
// FORM VALIDATION
// ========================================
function validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        return { valid: false, message: 'Please enter a phone number' };
    }
    
    if (phoneNumber.length !== 10) {
        return { valid: false, message: 'Phone number must be exactly 10 digits' };
    }
    
    if (!phoneNumber.match(/^0[2-5][0-9]{8}$/)) {
        return { valid: false, message: 'Invalid phone number format. Example: 0241234567' };
    }
    
    return { valid: true };
}

function validatePurchase() {
    // Check network selection
    if (!selectedNetwork) {
        showAlert('Please select a network provider', 'warning');
        return false;
    }
    
    // Check plan selection
    if (!selectedPlan) {
        showAlert('Please select a data plan to continue', 'warning');
        return false;
    }
    
    // Validate phone number
    const phoneNumber = document.getElementById('phoneNumber').value;
    const validation = validatePhoneNumber(phoneNumber);
    
    if (!validation.valid) {
        showAlert(validation.message, 'error');
        return false;
    }
    
    return true;
}

// ========================================
// PURCHASE PROCESSING
// ========================================
function purchaseData() {
    // Validate all inputs
    if (!validatePurchase()) {
        return;
    }
    
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    // Show loading overlay
    document.getElementById('loadingOverlay').classList.add('active');
    
    // Simulate API call (replace with actual API call in production)
    setTimeout(() => {
        // Hide loading overlay
        document.getElementById('loadingOverlay').classList.remove('active');
        
        // Generate transaction ID
        const txId = 'TXN' + Date.now();
        
        // Update success modal with transaction details
        populateSuccessModal(phoneNumber, txId);
        
        // Show success alert
        showAlert('Data bundle activated successfully!', 'success', 4000);
        
        // Show success modal
        document.getElementById('successModal').classList.add('active');
        
    }, 2000); // 2 second delay to simulate processing
}

function populateSuccessModal(phoneNumber, txId) {
    document.getElementById('successNetwork').textContent = selectedNetwork;
    document.getElementById('successPlan').textContent = selectedPlan.size;
    document.getElementById('successPhone').textContent = phoneNumber;
    document.getElementById('successAmount').textContent = `₵${selectedPlan.price.toFixed(2)}`;
    document.getElementById('successTxId').textContent = txId;
}

// ========================================
// MODAL MANAGEMENT
// ========================================
function closeSuccessModal() {
    // Hide modal
    document.getElementById('successModal').classList.remove('active');
    
    // Reset form
    resetPurchaseForm();
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show completion message
    showAlert('You can make another purchase', 'info', 3000);
}

function resetPurchaseForm() {
    // Clear phone number input
    document.getElementById('phoneNumber').value = '';
    
    // Reset network selection
    document.querySelectorAll('.network-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset plan selection
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide sections
    document.getElementById('dataPlansSection').classList.remove('active');
    document.getElementById('purchaseForm').classList.remove('active');
    
    // Reset summary display
    document.getElementById('summaryNetwork').textContent = 'Not selected';
    document.getElementById('summaryPlan').textContent = '-';
    document.getElementById('summaryPhone').textContent = '-';
    document.getElementById('summaryValidity').textContent = '-';
    document.getElementById('summaryTotal').textContent = '₵0.00';
    
    // Reset state variables
    selectedNetwork = null;
    selectedPlan = null;
}

// ========================================
// SIDEBAR MANAGEMENT
// ========================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburger');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// ========================================
// PAGE LOADER
// ========================================
const MIN_LOADER_TIME = 2000; // 2 seconds minimum
const startTime = Date.now();

window.addEventListener("load", () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_LOADER_TIME - elapsed);

    setTimeout(hideLoader, remaining);
});

function hideLoader() {
    const loader = document.getElementById("loader");
    const dashboard = document.querySelector(".dashboard");

    // Fade out loader
    loader.classList.add("hidden");

    // Show dashboard after fade completes
    setTimeout(() => {
        loader.style.display = "none";
        dashboard.style.display = "flex";
        dashboard.style.opacity = "1";
        
        // Show the initial alerts after loader is hidden
        showInitialAlerts();
    }, 600); // Match CSS transition duration
}

// Function to show initial alerts after page load
function showInitialAlerts() {
    // Show info alert
    showAlert('Data will be credited into your account within 5 minutes to 2 hours.', 'info', 8000);
    
    // Show warning alert after a short delay
    setTimeout(() => {
        showAlert('Data sent to a wrong number is not reversible. This service also does not support Turbo Net Sim-cards.', 'warning', 10000);
    }, 500);
}

// ========================================
// EVENT LISTENERS
// ========================================

// Hamburger menu toggle
document.getElementById('hamburger').addEventListener('click', toggleSidebar);

// Sidebar overlay click to close
document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);

// Close sidebar when menu item clicked on mobile
if (window.innerWidth <= 768) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', toggleSidebar);
    });
}

// Close alerts on button click (handled in showAlert function)

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Create alert container if it doesn't exist
    if (!document.getElementById('alertContainer')) {
        const alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        document.body.appendChild(alertContainer);
    }
    
    // Initialize close buttons for alerts that are already in the HTML
    const existingCloseButtons = document.querySelectorAll('.closebtn');
    existingCloseButtons.forEach(btn => {
        btn.onclick = function() {
            const alertElement = this.parentElement;
            closeAlert(alertElement);
        };
    });
});


// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format currency
function formatCurrency(amount) {
    return `₵${parseFloat(amount).toFixed(2)}`;
}

// Generate unique transaction ID
function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN${timestamp}${random}`;
}

// Validate Ghana phone number
function isValidGhanaPhone(phone) {
    // Ghana phone format: 0XX XXX XXXX (networks: 02X, 03X, 05X)
    const ghanaPhoneRegex = /^0[2-5][0-9]{8}$/;
    return ghanaPhoneRegex.test(phone);
}

// ============================================
// BALANCE VISIBILITY TOGGLE
// ============================================
function toggleBalance() {
    const balanceDisplay = document.getElementById('walletBalance');
    balanceVisible = !balanceVisible;
    
    if (balanceVisible) {
        balanceDisplay.textContent = `₵${walletBalance.toFixed(2)}`;
    } else {
        balanceDisplay.textContent = '₵****.**';
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function createNotificationPanel() {
    const panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.className = 'notification-panel';
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    let notificationHTML = `
        <div class="notification-header">
            <h3>Notifications</h3>
            <span class="notification-count">${unreadCount} New</span>
        </div>
        <div class="notification-actions">
            <button class="notification-action-btn" onclick="markAllAsRead()">Mark all as read</button>
            <button class="notification-action-btn" onclick="clearAllNotifications()">Clear all</button>
        </div>
        <div class="notification-list">
    `;
    
    if (notifications.length === 0) {
        notificationHTML += `
            <div class="notification-empty">
                <span style="font-size: 48px;">🔔</span>
                <p>No notifications yet</p>
            </div>
        `;
    } else {
        notifications.forEach(notif => {
            notificationHTML += `
                <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                    <div class="notification-icon ${notif.type}">${notif.icon}</div>
                    <div class="notification-content">
                        <div class="notification-title">${notif.title}</div>
                        <div class="notification-message">${notif.message}</div>
                        <div class="notification-time">${notif.time}</div>
                    </div>
                    <button class="notification-close" onclick="removeNotification(${notif.id})">×</button>
                </div>
            `;
        });
    }
    
    notificationHTML += `
        </div>
        <div class="notification-footer">
            <a href="#" class="view-all-link" onclick="closeNotificationPanel(event)">Close</a>
        </div>
    `;
    
    panel.innerHTML = notificationHTML;
    return panel;
}

function toggleNotifications() {
    let panel = document.getElementById('notificationPanel');
    
    if (panel) {
        // Close panel
        panel.classList.remove('active');
        setTimeout(() => panel.remove(), 300);
    } else {
        // Open panel
        panel = createNotificationPanel();
        document.body.appendChild(panel);
        
        // Position panel near notification button
        const notifBtn = document.querySelector('.notification-btn');
        if (notifBtn) {
            const rect = notifBtn.getBoundingClientRect();
            panel.style.top = rect.bottom + 10 + 'px';
            panel.style.right = window.innerWidth - rect.right + 'px';
        }
        
        // Trigger animation
        setTimeout(() => panel.classList.add('active'), 10);
        
        // Close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
        }, 100);
    }
    
    updateNotificationBadge();
}

function closeOnClickOutside(e) {
    const panel = document.getElementById('notificationPanel');
    const notifBtn = document.querySelector('.notification-btn');
    
    if (panel && !panel.contains(e.target) && !notifBtn.contains(e.target)) {
        panel.classList.remove('active');
        setTimeout(() => panel.remove(), 300);
        document.removeEventListener('click', closeOnClickOutside);
    }
}

function closeNotificationPanel(event) {
    if (event) event.preventDefault();
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.remove('active');
        setTimeout(() => panel.remove(), 300);
        document.removeEventListener('click', closeOnClickOutside);
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.remove();
        toggleNotifications();
    }
    showAlert('✓ All notifications marked as read', 'success');
}

function clearAllNotifications() {
    notifications.length = 0;
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.remove();
        toggleNotifications();
    }
    showAlert('✓ All notifications cleared', 'success');
}

function removeNotification(id) {
    const index = notifications.findIndex(n => n.id === id);
    if (index > -1) {
        notifications.splice(index, 1);
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.remove();
            toggleNotifications();
        }
    }
}

function updateNotificationBadge() {
    const notifBtn = document.querySelector('.notification-btn');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Add or remove has-notifications class
    if (unreadCount > 0 && notifBtn) {
        notifBtn.classList.add('has-notifications');
    } else if (notifBtn) {
        notifBtn.classList.remove('has-notifications');
    }
}

function addNotification(type, title, message) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const notification = {
        id: Date.now(),
        type: type,
        icon: icons[type] || 'ℹ️',
        title: title,
        message: message,
        time: 'Just now',
        read: false
    };

    notifications.unshift(notification);
    updateNotificationBadge();
}