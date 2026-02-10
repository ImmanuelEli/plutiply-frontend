// ========================================
// FETCH AND DISPLAY USER DATA
// ========================================
async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const data = await response.json();

        if (data.success) {
            // Update sidebar username
            document.getElementById('sidebarUsername').textContent = data.data.fullName;

            // Update user avatar initials
            const initials = data.data.fullName
                .split(' ')
                .map(word => word[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
            document.getElementById('sidebarAvatar').textContent = initials;
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Call fetchUserProfile when page loads
fetchUserProfile();
//Loader functions
const MIN_LOADER_TIME = 2000; // 2 cycles × 1s
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
    }, 600); // matches fade-out transition
}

// Constants
const WALLET_BALANCE = 0.00;
const MIN_AMOUNT = 1;
const PHONE_REGEX = /^0\d{9}$/;
const PROCESSING_TIME = 2000;

// State
let selectedNetwork = null;
let purchaseMode = 'single'; // 'single' or 'bulk'
let recipientCount = 0;
let isProcessing = false;
let balanceVisible = true;
const actualBalance = 54812.00;

// ========================================
// NOTIFICATION SYSTEM (Wallet Style)
// ========================================
const notifications = [
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

function toggleNotificationPanel() {
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
        toggleNotificationPanel();
    }
    showAlert('✓ All notifications marked as read', 'success', 3000);
}

function clearAllNotifications() {
    notifications.length = 0;
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.remove();
        toggleNotificationPanel();
    }
    showAlert('✓ All notifications cleared', 'success', 3000);
}

function removeNotification(id) {
    const index = notifications.findIndex(n => n.id === id);
    if (index > -1) {
        notifications.splice(index, 1);
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.remove();
            toggleNotificationPanel();
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

// Show Alert Function
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');

    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;

    alertContainer.appendChild(alert);

    // Auto remove after duration
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(400px)';
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

// Balance Visibility Toggle (Wallet Style)
function toggleBalance() {
    const balanceDisplay = document.getElementById('walletBalance');
    balanceVisible = !balanceVisible;

    if (balanceVisible) {
        balanceDisplay.textContent = `₵${actualBalance.toFixed(2)}`;
    } else {
        balanceDisplay.textContent = '₵****.**';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    setupEventListeners();
    updateNotificationBadge();
    // Add first recipient when in bulk mode
    addRecipient();

    // Add notification button click handler
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationPanel);
    }
}

function setupEventListeners() {
    // Mode toggle
    document.getElementById('singleModeBtn').addEventListener('click', () => switchMode('single'));
    document.getElementById('bulkModeBtn').addEventListener('click', () => switchMode('bulk'));

    // Network selection - Add keyboard support
    document.querySelectorAll('.network-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('click', function () {
            selectNetwork(this.dataset.network, this);
        });

        card.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectNetwork(this.dataset.network, this);
            }
        });
    });

    // Quick amount buttons - Single mode
    document.querySelectorAll('#quickAmounts .amount-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            setAmount(this.dataset.amount, 'single');
        });
    });

    // Quick amount buttons - Bulk mode
    document.querySelectorAll('.bulk-amount-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            setAmount(this.dataset.amount, 'bulk');
        });
    });

    // Form inputs
    document.getElementById('phoneNumber').addEventListener('input', handlePhoneInput);
    document.getElementById('amount').addEventListener('input', () => {
        clearQuickAmountSelection('single');
        updateSummary();
    });
    document.getElementById('bulkAmount').addEventListener('input', () => {
        clearQuickAmountSelection('bulk');
        updateSummary();
    });

    // Bulk mode
    document.getElementById('addRecipientBtn').addEventListener('click', addRecipient);

    // Purchase and clear buttons
    document.getElementById('purchaseBtn').addEventListener('click', purchaseAirtime);
    document.getElementById('clearBtn').addEventListener('click', resetForm);

    // Fund wallet button
    document.getElementById('fundWalletBtn').addEventListener('click', () => {
        showAlert('Redirecting to Fund Wallet page...', 'info', 2000);
        setTimeout(() => {
            window.location.href = 'mywallet.html';
        }, 1500);
    });

    // Success modal close
    document.getElementById('closeSuccessBtn').addEventListener('click', closeSuccessModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSuccessModal();
            closeNotificationPanel();
        }
    });

    // Close modal on outside click
    document.getElementById('successModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('successModal')) {
            closeSuccessModal();
        }
    });

    // Close sidebar when menu item clicked on mobile
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', toggleSidebar);
        });
    }
}

// ========================================
// ALERT SYSTEM
// ========================================
function showAlert(message, type = 'success', duration = 5000) {
    let container = document.getElementById('alertContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alertContainer';
        document.body.appendChild(container);
    }

    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(alert);

    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 600);
    }, duration);
}
// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburger');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
}

document.getElementById('hamburger').addEventListener('click', toggleSidebar);
document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);

// Close sidebar when menu item clicked on mobile
if (window.innerWidth <= 768) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', toggleSidebar);
    });
}

// Switch between single and bulk mode
function switchMode(mode) {
    purchaseMode = mode;

    // Update button states
    document.getElementById('singleModeBtn').classList.toggle('active', mode === 'single');
    document.getElementById('bulkModeBtn').classList.toggle('active', mode === 'bulk');

    // Show/hide appropriate fields
    document.getElementById('singleModeFields').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('bulkModeFields').classList.toggle('active', mode === 'bulk');

    // Update summary visibility
    document.getElementById('summaryPhoneRow').style.display = mode === 'single' ? 'flex' : 'none';
    document.getElementById('summaryRecipientsRow').style.display = mode === 'bulk' ? 'flex' : 'none';

    updateSummary();
}

// Select network
function selectNetwork(network, element) {
    selectedNetwork = network;

    // Remove selected class from all cards
    document.querySelectorAll('.network-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    element.classList.add('selected');

    // Update summary
    document.getElementById('summaryNetwork').textContent = network;
    updateSummary();
}

// Set amount from quick buttons
function setAmount(amount, mode) {
    if (mode === 'single') {
        document.getElementById('amount').value = amount;

        // Update button states
        document.querySelectorAll('#quickAmounts .amount-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.amount === amount);
        });
    } else {
        document.getElementById('bulkAmount').value = amount;

        // Update button states
        document.querySelectorAll('.bulk-amount-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.amount === amount);
        });
    }

    updateSummary();
}

// Clear quick amount selection
function clearQuickAmountSelection(mode) {
    if (mode === 'single') {
        document.querySelectorAll('#quickAmounts .amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    } else {
        document.querySelectorAll('.bulk-amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

// Handle phone input
function handlePhoneInput() {
    const phoneInput = document.getElementById('phoneNumber');
    const phoneError = document.getElementById('phoneError');

    // Remove non-digits
    phoneInput.value = phoneInput.value.replace(/\D/g, '');

    // Limit to 10 digits
    if (phoneInput.value.length > 10) {
        phoneInput.value = phoneInput.value.slice(0, 10);
    }

    // Clear error on input
    phoneError.classList.remove('show');
    phoneInput.classList.remove('error');

    updateSummary();
}

// Validate phone number
function validatePhone(phone) {
    return PHONE_REGEX.test(phone);
}

// Add recipient
function addRecipient() {
    recipientCount++;
    const recipientsList = document.getElementById('recipientsList');

    const recipientItem = document.createElement('div');
    recipientItem.className = 'recipient-item';
    recipientItem.dataset.recipientId = recipientCount;

    recipientItem.innerHTML = `
        <div class="recipient-header">
            <span class="recipient-number">Recipient ${recipientCount}</span>
            ${recipientCount > 1 ? '<button class="remove-recipient-btn" aria-label="Remove recipient">×</button>' : ''}
        </div>
        <div class="recipient-content">
            <div class="recipient-phone-group">
                <label>Phone Number</label>
                <input type="tel" class="recipient-phone-input" placeholder="e.g., 0241234567" maxlength="10">
                <span class="error-message recipient-error">Invalid phone number</span>
            </div>
            <div class="recipient-network-group">
                <label>Network</label>
                <div class="recipient-networks">
                    <button class="recipient-network-btn" data-network="MTN">MTN</button>
                    <button class="recipient-network-btn" data-network="AirtelTigo">AirtelTigo</button>
                    <button class="recipient-network-btn" data-network="Glo">Glo</button>
                    <button class="recipient-network-btn" data-network="Telecel">Telecel</button>
                </div>
            </div>
        </div>
    `;

    recipientsList.appendChild(recipientItem);

    // Add event listeners to the new recipient
    const phoneInput = recipientItem.querySelector('.recipient-phone-input');
    phoneInput.addEventListener('input', function () {
        // Remove non-digits
        this.value = this.value.replace(/\D/g, '');

        // Limit to 10 digits
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }

        // Clear error on input
        const error = recipientItem.querySelector('.recipient-error');
        error.classList.remove('show');
        this.classList.remove('error');

        updateSummary();
    });

    // Network selection
    recipientItem.querySelectorAll('.recipient-network-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove selected class from siblings
            recipientItem.querySelectorAll('.recipient-network-btn').forEach(b => {
                b.classList.remove('selected');
            });

            // Add selected class to this button
            this.classList.add('selected');

            updateSummary();
        });
    });

    // Remove recipient
    const removeBtn = recipientItem.querySelector('.remove-recipient-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function () {
            recipientItem.remove();
            updateRecipientNumbers();
            updateSummary();
        });
    }

    updateSummary();
}

// Update recipient numbers after removal
function updateRecipientNumbers() {
    const recipientItems = document.querySelectorAll('.recipient-item');
    recipientItems.forEach((item, index) => {
        item.querySelector('.recipient-number').textContent = `Recipient ${index + 1}`;
    });
}

// Update summary
function updateSummary() {
    if (purchaseMode === 'single') {
        updateSingleSummary();
    } else {
        updateBulkSummary();
    }
}

// Update single mode summary
function updateSingleSummary() {
    const phone = document.getElementById('phoneNumber').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;

    document.getElementById('summaryPhone').textContent = phone || '-';
    document.getElementById('summaryAmount').textContent = `₵${amount.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `₵${amount.toFixed(2)}`;
}

// Update bulk mode summary
function updateBulkSummary() {
    const amount = parseFloat(document.getElementById('bulkAmount').value) || 0;
    const recipientItems = document.querySelectorAll('.recipient-item');

    // Count valid recipients
    let validCount = 0;
    const networkCounts = {};

    recipientItems.forEach(item => {
        const phone = item.querySelector('.recipient-phone-input').value.trim();
        const selectedNetworkBtn = item.querySelector('.recipient-network-btn.selected');

        if (phone !== '' && selectedNetworkBtn && validatePhone(phone)) {
            validCount++;
            const network = selectedNetworkBtn.dataset.network;
            networkCounts[network] = (networkCounts[network] || 0) + 1;
        }
    });

    const totalCost = amount * validCount;

    document.getElementById('summaryRecipients').textContent = validCount;
    document.getElementById('summaryAmount').textContent = `₵${amount.toFixed(2)} × ${validCount}`;
    document.getElementById('summaryTotal').textContent = `₵${totalCost.toFixed(2)}`;

    // Show network breakdown if there are multiple networks
    const breakdownDiv = document.getElementById('summaryNetworkBreakdown');
    if (Object.keys(networkCounts).length > 1) {
        breakdownDiv.style.display = 'block';
        breakdownDiv.innerHTML = '<div style="margin: 10px 0; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">';

        Object.entries(networkCounts).forEach(([network, count]) => {
            breakdownDiv.innerHTML += `
                <div class="summary-item" style="font-size: 13px; margin: 5px 0;">
                    <span class="summary-label">${network}:</span>
                    <span class="summary-value">${count} recipient(s)</span>
                </div>
            `;
        });

        breakdownDiv.innerHTML += '</div>';
    } else {
        breakdownDiv.style.display = 'none';
    }
}

// Validate single purchase
function validateSinglePurchase() {
    let isValid = true;

    // Validate network
    if (!selectedNetwork) {
        showAlert('Please select a network', 'error');
        return false;
    }

    // Validate phone number
    const phone = document.getElementById('phoneNumber').value.trim();
    const phoneError = document.getElementById('phoneError');
    const phoneInput = document.getElementById('phoneNumber');

    if (!phone) {
        phoneError.textContent = 'Phone number is required';
        phoneError.classList.add('show');
        phoneInput.classList.add('error');
        isValid = false;
    } else if (!validatePhone(phone)) {
        phoneError.textContent = 'Please enter a valid 10-digit phone number starting with 0';
        phoneError.classList.add('show');
        phoneInput.classList.add('error');
        isValid = false;
    } else {
        phoneError.classList.remove('show');
        phoneInput.classList.remove('error');
    }

    // Validate amount
    const amount = parseFloat(document.getElementById('amount').value);
    const amountError = document.getElementById('amountError');
    const amountInput = document.getElementById('amount');

    if (!amount || amount < MIN_AMOUNT) {
        amountError.textContent = `Amount must be at least ₵${MIN_AMOUNT}`;
        amountError.classList.add('show');
        amountInput.classList.add('error');
        isValid = false;
    } else if (amount > WALLET_BALANCE) {
        amountError.textContent = 'Amount exceeds wallet balance';
        amountError.classList.add('show');
        amountInput.classList.add('error');
        isValid = false;
    } else {
        amountError.classList.remove('show');
        amountInput.classList.remove('error');
    }

    return isValid;
}

// Validate bulk purchase
function validateBulkPurchase() {
    let isValid = true;

    // Validate amount
    const amount = parseFloat(document.getElementById('bulkAmount').value);
    const amountError = document.getElementById('bulkAmountError');
    const amountInput = document.getElementById('bulkAmount');

    if (!amount || amount < MIN_AMOUNT) {
        amountError.textContent = `Amount must be at least ₵${MIN_AMOUNT}`;
        amountError.classList.add('show');
        amountInput.classList.add('error');
        return false;
    } else {
        amountError.classList.remove('show');
        amountInput.classList.remove('error');
    }

    // Validate recipients
    const recipientItems = document.querySelectorAll('.recipient-item');
    const validRecipients = [];
    const duplicates = [];
    const invalidRecipients = [];
    const missingNetworkRecipients = [];
    const phoneNumbers = new Set();

    recipientItems.forEach((item, index) => {
        const phoneInput = item.querySelector('.recipient-phone-input');
        const phoneError = item.querySelector('.recipient-error');
        const phone = phoneInput.value.trim();
        const selectedNetworkBtn = item.querySelector('.recipient-network-btn.selected');

        // Skip empty recipients
        if (phone === '' && !selectedNetworkBtn) {
            return;
        }

        // Check for duplicates
        if (phoneNumbers.has(phone)) {
            duplicates.push(phone);
            phoneError.textContent = 'Duplicate phone number';
            phoneError.classList.add('show');
            phoneInput.classList.add('error');
            isValid = false;
            return;
        }
        phoneNumbers.add(phone);

        // Validate phone format
        if (!validatePhone(phone)) {
            invalidRecipients.push(index + 1);
            phoneError.textContent = 'Invalid phone number';
            phoneError.classList.add('show');
            phoneInput.classList.add('error');
            isValid = false;
            return;
        }

        // Check if network is selected
        if (!selectedNetworkBtn) {
            missingNetworkRecipients.push(index + 1);
            isValid = false;
            return;
        }

        validRecipients.push({
            phone: phone,
            network: selectedNetworkBtn.dataset.network
        });
    });

    if (validRecipients.length === 0) {
        showAlert('Please add at least one recipient with phone number and network', 'error');
        return false;
    }

    if (duplicates.length > 0) {
        showAlert(`Duplicate phone number(s) detected: ${[...new Set(duplicates)].join(', ')}`, 'error');
        return false;
    }

    if (invalidRecipients.length > 0) {
        showAlert(`Invalid phone number(s) for recipient ${invalidRecipients.join(', ')}`, 'error');
        return false;
    }

    if (missingNetworkRecipients.length > 0) {
        showAlert(`Please select a network for recipient ${missingNetworkRecipients.join(', ')}`, 'error');
        return false;
    }

    // Check total cost against balance
    const totalCost = amount * validRecipients.length;
    if (totalCost > WALLET_BALANCE) {
        document.getElementById('bulkAmountError').classList.add('show');
        document.getElementById('bulkAmountError').textContent = `Total cost (₵${totalCost.toFixed(2)}) exceeds wallet balance`;
        document.getElementById('bulkAmount').classList.add('error');
        showAlert(`Total cost (₵${totalCost.toFixed(2)}) exceeds wallet balance`, 'error');
        isValid = false;
    }

    return isValid;
}

// Purchase airtime
function purchaseAirtime() {
    // Prevent double submission
    if (isProcessing) {
        return;
    }

    let isValid = false;

    if (purchaseMode === 'single') {
        isValid = validateSinglePurchase();
    } else {
        isValid = validateBulkPurchase();
    }

    if (!isValid) {
        return;
    }

    // Set processing state
    isProcessing = true;

    // Disable button
    const purchaseBtn = document.getElementById('purchaseBtn');
    purchaseBtn.disabled = true;
    purchaseBtn.textContent = 'Processing...';

    // Show loading
    document.getElementById('loadingOverlay').classList.add('active');

    // Simulate API call
    setTimeout(() => {
        // Re-enable button
        purchaseBtn.disabled = false;
        purchaseBtn.textContent = 'Purchase Airtime';
        isProcessing = false;

        // Hide loading
        document.getElementById('loadingOverlay').classList.remove('active');

        if (purchaseMode === 'single') {
            showSingleSuccess();
        } else {
            showBulkSuccess();
        }
    }, PROCESSING_TIME);
}

// Show single purchase success
function showSingleSuccess() {
    const phone = document.getElementById('phoneNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const txId = generateTransactionId();

    document.getElementById('successTitle').textContent = 'Purchase Successful!';
    document.getElementById('successMessage').textContent = 'Your airtime has been successfully delivered';

    document.getElementById('singleSuccessDetails').style.display = 'block';
    document.getElementById('bulkSuccessDetails').style.display = 'none';

    document.getElementById('successNetwork').textContent = selectedNetwork;
    document.getElementById('successPhone').textContent = phone;
    document.getElementById('successAmount').textContent = `₵${amount.toFixed(2)}`;
    document.getElementById('successTxId').textContent = txId;

    document.getElementById('successModal').classList.add('active');

    // Add notification
    addNotification('success', 'Purchase Successful', `Airtime of ₵${amount.toFixed(2)} sent to ${phone}`);

    // Show success alert
    showAlert(`✓ Airtime sent successfully to ${phone}`, 'success', 3000);

    resetForm();
}

// Show bulk purchase success
function showBulkSuccess() {
    const amount = parseFloat(document.getElementById('bulkAmount').value);
    const recipientItems = document.querySelectorAll('.recipient-item');

    const validRecipients = [];
    recipientItems.forEach(item => {
        const phone = item.querySelector('.recipient-phone-input').value.trim();
        const selectedNetworkBtn = item.querySelector('.recipient-network-btn.selected');

        if (phone !== '' && selectedNetworkBtn && validatePhone(phone)) {
            validRecipients.push({
                phone: phone,
                network: selectedNetworkBtn.dataset.network
            });
        }
    });

    document.getElementById('successTitle').textContent = 'Bulk Purchase Successful!';
    document.getElementById('successMessage').textContent = `Airtime successfully sent to ${validRecipients.length} recipient(s)`;

    document.getElementById('singleSuccessDetails').style.display = 'none';
    document.getElementById('bulkSuccessDetails').style.display = 'block';

    const bulkList = document.getElementById('bulkSuccessDetails');
    bulkList.innerHTML = '';

    validRecipients.forEach((recipient, index) => {
        const txId = generateTransactionId();
        const item = document.createElement('div');
        item.className = 'bulk-success-item';
        item.innerHTML = `
            <div class="detail-row">
                <span>${index + 1}. ${recipient.phone}</span>
                <strong>₵${amount.toFixed(2)}</strong>
            </div>
            <div class="detail-row">
                <span>Network: ${recipient.network}</span>
                <strong style="font-size: 12px;">TX: ${txId}</strong>
            </div>
        `;
        bulkList.appendChild(item);
    });

    document.getElementById('successModal').classList.add('active');

    // Add notification
    addNotification('success', 'Bulk Purchase Successful', `Airtime sent to ${validRecipients.length} recipients`);

    // Show success alert
    showAlert(`✓ Airtime sent to ${validRecipients.length} recipients`, 'success', 3000);

    resetForm();
}

// Generate transaction ID
function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PLT${timestamp.toString().slice(-6)}${random.toString().padStart(4, '0')}`;
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Reset form
function resetForm() {
    // Clear inputs
    document.getElementById('phoneNumber').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('bulkAmount').value = '';

    // Clear errors
    document.querySelectorAll('.error-message').forEach(error => error.classList.remove('show'));
    document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));

    // Clear network selection
    document.querySelectorAll('.network-card').forEach(card => card.classList.remove('selected'));
    selectedNetwork = null;

    // Clear quick amount selection
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));

    // Reset bulk recipients
    const recipientsList = document.getElementById('recipientsList');
    recipientsList.innerHTML = '';
    recipientCount = 0;

    // Add fresh first recipient
    addRecipient();

    // Reset summary display
    document.getElementById('summaryNetwork').textContent = 'Not selected';
    document.getElementById('summaryPhone').textContent = '-';
    document.getElementById('summaryRecipients').textContent = '0';
    document.getElementById('summaryAmount').textContent = '₵0.00';
    document.getElementById('summaryTotal').textContent = '₵0.00';
    document.getElementById('summaryNetworkBreakdown').style.display = 'none';

    updateSummary();
}
