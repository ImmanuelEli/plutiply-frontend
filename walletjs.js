 let balanceVisible = true;
 const actualBalance = '₵0.00';

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

// Toggle balance visibility
function toggleBalance() {
    const balanceDisplay = document.getElementById('balanceDisplay');
    balanceVisible = !balanceVisible;
    
    if (balanceVisible) {
        balanceDisplay.textContent = actualBalance;
    } else {
        balanceDisplay.textContent = '₵****.**';
    }
}

// Fund Modal
function openFundModal() {
    document.getElementById('fundModal').classList.add('active');
}

function closeFundModal() {
    document.getElementById('fundModal').classList.remove('active');
}

// Withdraw Modal
function openWithdrawModal() {
    document.getElementById('withdrawModal').classList.add('active');
}

function closeWithdrawModal() {
    document.getElementById('withdrawModal').classList.remove('active');
}

// Select payment method
function selectPaymentMethod(element) {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    element.classList.add('selected');

    // Show/hide fields based on selection
    const methodName = element.querySelector('h4').textContent;
    const cardFields = document.getElementById('cardFields');
    const cardExtraFields = document.getElementById('cardExtraFields');
    const phoneNumberField = document.getElementById('phoneNumberField');

    if (methodName === 'Debit/Credit Card') {
        cardFields.style.display = 'block';
        cardExtraFields.style.display = 'grid';
        phoneNumberField.style.display = 'none';
    } else if (methodName === 'Mobile Money') {
        cardFields.style.display = 'none';
        cardExtraFields.style.display = 'none';
        phoneNumberField.style.display = 'block';
    } else {
        cardFields.style.display = 'none';
        cardExtraFields.style.display = 'none';
        phoneNumberField.style.display = 'none';
    }
}

// Process funding
function processFunding() {
    const amount = document.getElementById('fundAmount').value;
    
    if (!amount || amount < 5) {
        showAlert('Please enter an amount of at least ₵5');
        return;
    }

    showAlert(`Processing payment of ₵${amount}...\n\nThis will be connected to Paystack API in the backend.`);
    closeFundModal();
}

// Process withdrawal
function processWithdrawal() {

    closeWithdrawModal();
}

// Filter transactions
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.textContent;
        // Filter logic will be implemented with backend
        console.log('Filtering by:', filter);
    });
});

// // Quick action cards
// document.querySelectorAll('.action-card').forEach(card => {
//     card.addEventListener('click', function() {
//         const action = this.querySelector('h3').textContent;
//         showAlert(`Navigating to ${action} page...`);
//     });
// });

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Menu item navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});


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
        
        // Update notification badge
        updateNotificationBadge();
        
        // Add notification button click handler
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', toggleNotificationPanel);
        }
    }, 600); // matches fade-out transition
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

// ========================================
// NOTIFICATION SYSTEM
// ========================================
const notifications = [
    {
        id: 1,
        icon: '💸',
        title: 'Welcome To Plutiply!',
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

// ========================================
// TRANSFER MODAL FUNCTIONS
// ========================================
let selectedTransferType = null;

function openTransferModal() {
    document.getElementById('transferModal').classList.add('active');
    // Reset form
    resetTransferForm();
}

function closeTransferModal() {
    document.getElementById('transferModal').classList.remove('active');
    resetTransferForm();
}

function selectTransferType(type) {
    selectedTransferType = type;
    
    // Update UI
    document.querySelectorAll('.transfer-type').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.closest('.transfer-type').classList.add('selected');
    
    // Hide all fields first
    document.getElementById('bankFields').style.display = 'none';
    document.getElementById('momoFields').style.display = 'none';
    document.getElementById('p2pFields').style.display = 'none';
    
    // Show relevant fields
    if (type === 'bank') {
        document.getElementById('bankFields').style.display = 'block';
    } else if (type === 'momo') {
        document.getElementById('momoFields').style.display = 'block';
    } else if (type === 'p2p') {
        document.getElementById('p2pFields').style.display = 'block';
    }
    
    // Show common fields
    document.getElementById('amountField').style.display = 'block';
    document.getElementById('descriptionField').style.display = 'block';
}

function resetTransferForm() {
    selectedTransferType = null;
    document.querySelectorAll('.transfer-type').forEach(el => {
        el.classList.remove('selected');
    });
    document.getElementById('bankFields').style.display = 'none';
    document.getElementById('momoFields').style.display = 'none';
    document.getElementById('p2pFields').style.display = 'none';
    document.getElementById('amountField').style.display = 'none';
    document.getElementById('descriptionField').style.display = 'none';
    
    // Clear all inputs
    document.querySelectorAll('.transfer-fields input, .transfer-fields select').forEach(input => {
        input.value = '';
    });
    document.getElementById('transferAmount').value = '';
    document.getElementById('transferDescription').value = '';
}

function processTransfer() {
    if (!selectedTransferType) {
        showAlert('⚠️ Please select a transfer type', 'warning', 4000);
        return;
    }
    
    const amount = document.getElementById('transferAmount').value;
    
    if (!amount || parseFloat(amount) <= 0) {
        showAlert('⚠️ Please enter a valid amount', 'warning', 4000);
        return;
    }
    
    let recipient = '';
    let accountNumber = '';
    
    // Validate based on transfer type
    if (selectedTransferType === 'bank') {
        const bankName = document.getElementById('bankName').value;
        accountNumber = document.getElementById('bankAccountNumber').value;
        
        if (!bankName) {
            showAlert('⚠️ Please select a bank', 'warning', 4000);
            return;
        }
        if (!accountNumber) {
            showAlert('⚠️ Please enter account number', 'warning', 4000);
            return;
        }
        recipient = `${bankName} - ${accountNumber}`;
        
    } else if (selectedTransferType === 'momo') {
        const network = document.getElementById('momoNetwork').value;
        const phone = document.getElementById('momoPhone').value;
        
        if (!network) {
            showAlert('⚠️ Please select a network', 'warning', 4000);
            return;
        }
        if (!phone) {
            showAlert('⚠️ Please enter phone number', 'warning', 4000);
            return;
        }
        recipient = `${network} - ${phone}`;
        
    } else if (selectedTransferType === 'p2p') {
        const username = document.getElementById('p2pUsername').value;
        
        if (!username) {
            showAlert('⚠️ Please enter plutiply username', 'warning', 4000);
            return;
        }
        recipient = username;
    }
    
    
    // Show cedi loader
    showCediLoader();
    
    // Close transfer modal
    closeTransferModal();
    
    // Simulate transfer processing
    setTimeout(() => {
        hideCediLoader();
        
        // Here you would make API call to backend
        showAlert(`✅ Transfer of ₵${amount} to ${recipient} initiated successfully!`, 'success', 5000);
        
        // Add notification
        notifications.unshift({
            id: Date.now(),
            icon: '💸',
            title: 'Transfer Successful',
            message: `₵${amount} sent to ${recipient}`,
            time: 'Just now',
            read: false,
            type: 'success'
        });
        updateNotificationBadge();
    }, 2500); // 2.5 seconds loading
}

// Add input listeners for beneficiary name lookup (placeholder for API)
document.addEventListener('DOMContentLoaded', function() {
    // Bank account lookup
    const bankAccountInput = document.getElementById('bankAccountNumber');
    const bankNameInput = document.getElementById('bankAccountName');
    
    if (bankAccountInput && bankNameInput) {
        bankAccountInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            if (!value) {
                bankNameInput.value = '';
                return;
            }
            
            if (value.length >= 10) {
                bankNameInput.value = 'Looking up...';
                
                setTimeout(() => {
                    // TODO: Replace with actual API call
                    // Example: fetchBankAccountName(value).then(name => bankNameInput.value = name);
                    bankNameInput.value = 'API Integration Pending';
                }, 500);
            }
        });
    }
    
    // Mobile Money lookup
    const momoPhoneInput = document.getElementById('momoPhone');
    const momoNameInput = document.getElementById('momoAccountName');
    
    if (momoPhoneInput && momoNameInput) {
        momoPhoneInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            if (!value) {
                momoNameInput.value = '';
                return;
            }
            
            if (value.length >= 10) {
                momoNameInput.value = 'Looking up...';
                
                setTimeout(() => {
                    // TODO: Replace with actual API call
                    // Example: fetchMoMoAccountName(value).then(name => momoNameInput.value = name);
                    momoNameInput.value = 'API Integration Pending';
                }, 500);
            }
        });
    }
    
    // P2P User lookup
    const p2pUsernameInput = document.getElementById('p2pUsername');
    const p2pNameInput = document.getElementById('p2pRecipientName');
    
    if (p2pUsernameInput && p2pNameInput) {
        p2pUsernameInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            if (!value) {
                p2pNameInput.value = '';
                return;
            }
            
            if (value.length >= 3) {
                p2pNameInput.value = 'Looking up...';
                
                setTimeout(() => {
                    // TODO: Replace with actual API call
                    // Example: fetchPlutliplyUser(value).then(name => p2pNameInput.value = name);
                    p2pNameInput.value = 'API Integration Pending';
                }, 500);
            }
        });
    }
});
// ========================================
// CEDI LOADER FUNCTIONS
// ========================================
function showCediLoader() {
    const loader = document.getElementById('cediLoader');
    if (loader) {
        loader.classList.add('active');
    }
}

function hideCediLoader() {
    const loader = document.getElementById('cediLoader');
    if (loader) {
        loader.classList.remove('active');
    }
}

// ========================================
// BUY AIRTIME MODAL FUNCTIONS
// ========================================
function openAirtimeModal() {
    document.getElementById('airtimeModal').classList.add('active');
}

function closeAirtimeModal() {
    document.getElementById('airtimeModal').classList.remove('active');
    // Reset form
    document.getElementById('airtimeNetwork').value = '';
    document.getElementById('airtimePhone').value = '';
    document.getElementById('airtimeAmount').value = '';
}

function processAirtime() {
    const network = document.getElementById('airtimeNetwork').value;
    const phone = document.getElementById('airtimePhone').value;
    const amount = document.getElementById('airtimeAmount').value;
    
    if (!network) {
        showAlert('⚠️ Please select a network', 'warning', 4000);
        return;
    }
    if (!phone) {
        showAlert('⚠️ Please enter phone number', 'warning', 4000);
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        showAlert('⚠️ Please enter a valid amount', 'warning', 4000);
        return;
    }
    
    closeAirtimeModal();
    showCediLoader();
    
    setTimeout(() => {
        hideCediLoader();
        showAlert(`✅ Airtime purchase of ₵${amount} for ${phone} successful!`, 'success', 5000);
        
        // Add notification
        notifications.unshift({
            id: Date.now(),
            icon: '📱',
            title: 'Airtime Purchase',
            message: `₵${amount} airtime sent to ${phone}`,
            time: 'Just now',
            read: false,
            type: 'success'
        });
        updateNotificationBadge();
    }, 2000);
}

// ========================================
// BUY DATA MODAL FUNCTIONS
// ========================================
function openDataModal() {
    document.getElementById('dataModal').classList.add('active');
}

function closeDataModal() {
    document.getElementById('dataModal').classList.remove('active');
    // Reset form
    document.getElementById('dataNetwork').value = '';
    document.getElementById('dataPhone').value = '';
    document.getElementById('dataBundle').value = '';
}

function processData() {
    const network = document.getElementById('dataNetwork').value;
    const phone = document.getElementById('dataPhone').value;
    const bundle = document.getElementById('dataBundle').value;
    
    if (!network) {
        showAlert('⚠️ Please select a network', 'warning', 4000);
        return;
    }
    if (!phone) {
        showAlert('⚠️ Please enter phone number', 'warning', 4000);
        return;
    }
    if (!bundle) {
        showAlert('⚠️ Please select a data bundle', 'warning', 4000);
        return;
    }
    
    closeDataModal();
    showCediLoader();
    
    setTimeout(() => {
        hideCediLoader();
        const bundleText = document.getElementById('dataBundle').selectedOptions[0].text;
        showAlert(`✅ Data bundle ${bundleText} for ${phone} successful!`, 'success', 5000);
        
        // Add notification
        notifications.unshift({
            id: Date.now(),
            icon: '📊',
            title: 'Data Purchase',
            message: `${bundleText} sent to ${phone}`,
            time: 'Just now',
            read: false,
            type: 'success'
        });
        updateNotificationBadge();
    }, 2000);
}

// ========================================
// PAY BILLS MODAL FUNCTIONS
// ========================================
function openBillsModal() {
    document.getElementById('billsModal').classList.add('active');
}

function closeBillsModal() {
    document.getElementById('billsModal').classList.remove('active');
    // Reset form
    document.getElementById('billType').value = '';
    document.getElementById('billProvider').value = '';
    document.getElementById('billAccount').value = '';
    document.getElementById('billAmount').value = '';
    document.getElementById('providerField').style.display = 'none';
    document.getElementById('accountField').style.display = 'none';
    document.getElementById('amountFieldBills').style.display = 'none';
}

function updateBillFields() {
    const billType = document.getElementById('billType').value;
    const providerField = document.getElementById('providerField');
    const accountField = document.getElementById('accountField');
    const amountField = document.getElementById('amountFieldBills');
    const providerLabel = document.getElementById('providerLabel');
    const accountLabel = document.getElementById('accountLabel');
    const providerSelect = document.getElementById('billProvider');
    
    if (!billType) {
        providerField.style.display = 'none';
        accountField.style.display = 'none';
        amountField.style.display = 'none';
        return;
    }
    
    // Show all fields
    providerField.style.display = 'block';
    accountField.style.display = 'block';
    amountField.style.display = 'block';
    
    // Update labels and options based on bill type
    if (billType === 'electricity') {
        providerLabel.textContent = 'Electricity Company';
        accountLabel.textContent = 'Meter Number';
        providerSelect.innerHTML = `
            <option value="">Select company</option>
            <option value="ecg">ECG</option>
        `;
    } else if (billType === 'cable') {
        providerLabel.textContent = 'Cable Provider';
        accountLabel.textContent = 'Smartcard Number';
        providerSelect.innerHTML = `
            <option value="">Select provider</option>
            <option value="dstv">DSTV</option>
            <option value="gotv">GOtv</option>
            <option value="startimes">StarTimes</option>
        `;
    } else if (billType === 'water') {
        providerLabel.textContent = 'Water Company';
        accountLabel.textContent = 'Account Number';
        providerSelect.innerHTML = `
            <option value="">Select company</option>
            <option value="gwcl">GWCL</option>
            
        `;
    }
}

function processBill() {
    const billType = document.getElementById('billType').value;
    const provider = document.getElementById('billProvider').value;
    const account = document.getElementById('billAccount').value;
    const amount = document.getElementById('billAmount').value;
    
    if (!billType) {
        showAlert('⚠️ Please select bill type', 'warning', 4000);
        return;
    }
    if (!provider) {
        showAlert('⚠️ Please select provider', 'warning', 4000);
        return;
    }
    if (!account) {
        showAlert('⚠️ Please enter account number', 'warning', 4000);
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        showAlert('⚠️ Please enter a valid amount', 'warning', 4000);
        return;
    }
    
    closeBillsModal();
    showCediLoader();
    
    setTimeout(() => {
        hideCediLoader();
        const billTypeText = billType.charAt(0).toUpperCase() + billType.slice(1);
        showAlert(`✅ ${billTypeText} bill payment of ₵${amount} successful!`, 'success', 5000);
        
        // Add notification
        notifications.unshift({
            id: Date.now(),
            icon: '💳',
            title: `${billTypeText} Bill Payment`,
            message: `₵${amount} paid for account ${account}`,
            time: 'Just now',
            read: false,
            type: 'success'
        });
        updateNotificationBadge();
    }, 2000);
}
