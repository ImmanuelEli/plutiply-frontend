// Loader functions
const MIN_LOADER_TIME = 2000; // 2 seconds
const startTime = Date.now();

window.addEventListener("load", () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_LOADER_TIME - elapsed);

    setTimeout(hideLoader, remaining);
});

function hideLoader() {
    const loader = document.getElementById("loader");
    const dashboard = document.querySelector(".dashboard");

    loader.classList.add("hidden");

    setTimeout(() => {
        loader.style.display = "none";
        dashboard.style.display = "flex";
        dashboard.style.opacity = "1";
    }, 600);
} 

// Constants
const WALLET_BALANCE = 0.00;
const PROCESSING_TIME = 2000;

// Exam prices(We will discuss the pricing strategy later, for now we can set it to 0 for testing)
const EXAM_PRICES = {
    'BECE': 0.00,
    'WASSCE': 0.00
};

// State
let selectedExam = null;
let isProcessing = false;
let balanceVisible = true;
const actualBalance = 0.00;

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

// ========================================
// ALERT SYSTEM
// ========================================
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 600);
    }, 5000);
}

// ========================================
// BALANCE TOGGLE
// ========================================
function toggleBalance() {
    const balanceElement = document.getElementById('walletBalance');
    balanceVisible = !balanceVisible;
    
    if (balanceVisible) {
        balanceElement.textContent = `₵${actualBalance.toFixed(2)}`;
    } else {
        balanceElement.textContent = '₵****';
    }
}

// ========================================
// MOBILE MENU
// ========================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

hamburger?.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    hamburger.classList.toggle('active');
});

sidebarOverlay?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('active');
});

// ========================================
// EXAM SELECTION
// ========================================
document.querySelectorAll('.exam-card').forEach(card => {
    card.addEventListener('click', () => selectExam(card));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectExam(card);
        }
    });
});

function selectExam(card) {
    document.querySelectorAll('.exam-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedExam = card.dataset.exam;
    updateSummary();
    showAlert(`${selectedExam} selected`, 'success');
}

// ========================================
// PURCHASE MODE TOGGLE
// ========================================
// FORM INPUT LISTENERS
// ========================================
const recipientMobile = document.getElementById('recipientMobile');
const quantity = document.getElementById('quantity');

recipientMobile?.addEventListener('input', updateSummary);
quantity?.addEventListener('input', updateSummary);

// ========================================
// UPDATE SUMMARY
// ========================================
function updateSummary() {
    const summaryExam = document.getElementById('summaryExam');
    const summaryMobile = document.getElementById('summaryMobile');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Update exam type
    summaryExam.textContent = selectedExam || 'Not selected';
    
    const mobile = recipientMobile?.value.trim() || '';
    const qty = parseInt(quantity?.value) || 0;
    
    summaryMobile.textContent = mobile || '-';
    summaryQuantity.textContent = qty;
    
    let total = 0;
    if (selectedExam && qty > 0) {
        total = EXAM_PRICES[selectedExam] * qty;
    }
    
    summaryTotal.textContent = `₵${total.toFixed(2)}`;
}

// ========================================
// PURCHASE VALIDATION & SUBMISSION
// ========================================
const purchaseBtn = document.getElementById('purchaseBtn');
purchaseBtn.addEventListener('click', purchaseVoucher);

function purchaseVoucher() {
    if (isProcessing) return;
    
    // Validation
    if (!selectedExam) {
        showAlert('Please select an exam type', 'error');
        return;
    }
    
    if (!validateSinglePurchase()) return;
    
    // Check wallet balance
    const total = parseFloat(document.getElementById('summaryTotal').textContent.replace('₵', ''));
    if (total > actualBalance) {
        showAlert('Insufficient wallet balance', 'error');
        return;
    }
    
    processPurchase();
}

function validateSinglePurchase() {
    const mobile = recipientMobile.value.trim();
    const qty = parseInt(quantity.value);
    
    const mobileError = document.getElementById('mobileError');
    const quantityError = document.getElementById('quantityError');
    
    let isValid = true;
    
    if (!mobile) {
        mobileError.style.display = 'block';
        recipientMobile.style.borderColor = '#f44336';
        isValid = false;
    } else {
        mobileError.style.display = 'none';
        recipientMobile.style.borderColor = 'rgba(76, 175, 80, 0.3)';
    }
    
    if (!qty || qty < 1) {
        quantityError.style.display = 'block';
        quantity.style.borderColor = '#f44336';
        isValid = false;
    } else {
        quantityError.style.display = 'none';
        quantity.style.borderColor = 'rgba(76, 175, 80, 0.3)';
    }
    
    return isValid;
}

function processPurchase() {
    isProcessing = true;
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    // Simulate processing
    setTimeout(() => {
        loadingOverlay.classList.remove('active');
        showSuccessModal();
        isProcessing = false;
    }, PROCESSING_TIME);
}

// ========================================
// SUCCESS MODAL
// ========================================
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const singleDetails = document.getElementById('singleSuccessDetails');
    
    const txId = 'EXM' + Date.now().toString().slice(-8);
    
    singleDetails.style.display = 'block';
    
    const mobile = recipientMobile.value.trim();
    const qty = parseInt(quantity.value);
    const total = EXAM_PRICES[selectedExam] * qty;
    
    document.getElementById('successExam').textContent = selectedExam;
    document.getElementById('successMobile').textContent = mobile;
    document.getElementById('successQuantity').textContent = qty;
    document.getElementById('successAmount').textContent = `₵${total.toFixed(2)}`;
    document.getElementById('successTxId').textContent = txId;
    
    modal.classList.add('active');
    showAlert('Purchase successful!', 'success');
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    clearForm();
}

// ========================================
// CLEAR FORM
// ========================================
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', clearForm);

function clearForm() {
    // Clear fields
    if (recipientMobile) recipientMobile.value = '';
    if (quantity) quantity.value = '1';
    
    // Clear selection
    document.querySelectorAll('.exam-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedExam = null;
    
    // Clear errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = 'rgba(76, 175, 80, 0.3)';
    });
    
    updateSummary();
}

// ========================================
// FUND WALLET (Should direct to wallet page)
// ========================================
const fundWalletBtn = document.getElementById('fundWalletBtn');
fundWalletBtn?.addEventListener('click', () => {
    showAlert('Fund wallet feature coming soon', 'info');
});

// ========================================
// CLOSE SUCCESS MODAL BUTTON
// ========================================
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
closeSuccessBtn.addEventListener('click', closeSuccessModal);

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    updateNotificationBadge();
    updateSummary();
});