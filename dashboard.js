// ========================================
// ALERT SYSTEM
// ========================================
function showAlert(message, type = 'success', duration = 5000) {
    // Create alert container if it doesn't exist
    let container = document.getElementById('alertContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alertContainer';
        document.body.appendChild(container);
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        ${message}
        <button class="closebtn" onclick="this.parentElement.remove()">×</button>
    `;

    // Add to container
    container.appendChild(alert);

    // Auto-remove after duration
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
        icon: '💰',
        title: 'Payment Received',
        message: 'You received ₵500.00 from Ama Osei',
        time: '5 min ago',
        read: false,
        type: 'success'
    },
    {
        id: 2,
        icon: '📱',
        title: 'Airtime Purchase',
        message: 'Your ₵50 MTN airtime has been delivered',
        time: '1 hour ago',
        read: false,
        type: 'info'
    },
    {
        id: 3,
        icon: '⚠️',
        title: 'Low Balance Alert',
        message: 'Your wallet balance is below ₵10,000',
        time: '2 hours ago',
        read: false,
        type: 'warning'
    },
    {
        id: 4,
        icon: '🎁',
        title: 'Referral Bonus',
        message: 'You earned ₵20 from a referral!',
        time: '1 day ago',
        read: true,
        type: 'success'
    },
    {
        id: 5,
        icon: '📊',
        title: 'Monthly Report',
        message: 'Your monthly spending report is ready',
        time: '2 days ago',
        read: true,
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
            <a href="#" class="view-all-link">View All Notifications</a>
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
        const notifBtn = document.querySelector('.header-actions .icon-btn');
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
    const notifBtn = document.querySelector('.header-actions .icon-btn');
    
    if (panel && !panel.contains(e.target) && !notifBtn.contains(e.target)) {
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
    const notifBtn = document.querySelector('.header-actions .icon-btn');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Remove existing badge
    const existingBadge = document.querySelector('.notification-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Add new badge if there are unread notifications
    if (unreadCount > 0 && notifBtn) {
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        notifBtn.style.position = 'relative';
        notifBtn.appendChild(badge);
    }
}

// ========================================
// SIDEBAR TOGGLE
// ========================================
function toggleSidebar() {
    if(window.innerWidth <= 769){
        document.querySelector('.sidebar').classList.toggle('active');
        document.querySelector('.sidebar-overlay').classList.toggle('active');
        document.getElementById('hamburger').classList.toggle('active');
    }
}

// ========================================
// LOADER FUNCTIONS
// ========================================
const MIN_LOADER_TIME = 3000; // 3 cycles × 1s
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
        
        // Show welcome alert after dashboard is visible
        setTimeout(() => {
            showAlert('🎉 You have successfully logged into Plutiply!', 'success', 6000);
        }, 300);
        
        // Update notification badge
        updateNotificationBadge();
    }, 600); // matches fade-out transition
}

// ========================================
// QUICK TRANSFER FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Notification button click handler
    const notificationBtn = document.querySelector('.header-actions .icon-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleNotificationPanel();
        });
    }

    // Send button alert
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const accountInput = document.getElementById('accountInput');
            const amountInput = document.getElementById('amountInput');
            
            if (accountInput && amountInput) {
                const account = accountInput.value.trim();
                const amount = amountInput.value.trim();
                
                if (!account || !amount) {
                    showAlert('⚠️ Please fill in all transfer details', 'warning', 4000);
                } else if (parseFloat(amount) <= 0) {
                    showAlert('⚠️ Please enter a valid amount', 'warning', 4000);
                } else {
                    // Show cedi loader
                    showCediLoader();
                    
                    // Simulate transfer processing (replace with actual API call)
                    setTimeout(() => {
                        hideCediLoader();
                        
                        showAlert(`✅ Transfer of ₵${amount} initiated successfully!`, 'success', 5000);
                        
                        // Add notification for successful transfer
                        notifications.unshift({
                            id: Date.now(),
                            icon: '💸',
                            title: 'Transfer Sent',
                            message: `₵${amount} sent to ${account}`,
                            time: 'Just now',
                            read: false,
                            type: 'success'
                        });
                        
                        updateNotificationBadge();
                        
                        // Clear inputs
                        accountInput.value = '';
                        amountInput.value = '';
                        document.getElementById('beneficiaryName').value = '';
                    }, 2000); // 2 second loader (adjust as needed)
                }
            }
        });
    }

    // Recent contacts click alerts
    const contactAvatars = document.querySelectorAll('.contact-avatar');
    contactAvatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            const name = this.getAttribute('title');
            const accountInput = document.getElementById('accountInput');
            const beneficiaryInput = document.getElementById('beneficiaryName');
            if (accountInput && beneficiaryInput && name) {
                // Simulate filling in contact info
                accountInput.value = name;
                beneficiaryInput.value = name;
                showAlert(`📱 ${name} selected for quick transfer`, 'info', 3000);
            }
        });
    });

    // Add hover effect for chart bars with data
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        bar.addEventListener('click', function() {
            const month = this.getAttribute('data-month') || this.getAttribute('data-day');
            const height = this.style.height;
            if (month) {
                showAlert(`📊 ${month}: Activity at ${height}`, 'info', 3000);
            }
        });
    });

    // Low balance warning (example - check if balance is below threshold)
    const walletBalance = document.querySelector('.stat-card .stat-value');
    if (walletBalance) {
        const balanceText = walletBalance.textContent.replace(/[₵,]/g, '');
        const balance = parseFloat(balanceText);
        
        // Show low balance warning if balance is below 2 cedis
        if (balance < 2) {
            setTimeout(() => {
                showAlert('⚠️ Your wallet balance is running low. Consider topping up!', 'warning', 6000);
            }, 8000); // Show after 8 seconds
        }
    }

    // Spending goal achievement check
    const spendingGoal = document.querySelectorAll('.stat-card')[2];
    if (spendingGoal) {
        const goalChange = spendingGoal.querySelector('.stat-change');
        if (goalChange && goalChange.textContent.includes('+')) {
            setTimeout(() => {
                showAlert('🎯 Great job! You\'re ahead of your spending goal!', 'success', 5000);
            }, 12000); // Show after 12 seconds
        }
    }

    // Account input listener for beneficiary name lookup (placeholder for API)
    const accountInput = document.getElementById('accountInput');
    const beneficiaryInput = document.getElementById('beneficiaryName');
    
    if (accountInput && beneficiaryInput) {
        accountInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            // Clear beneficiary name if account input is cleared
            if (!value) {
                beneficiaryInput.value = '';
                return;
            }
            
            // Placeholder for API integration
            // In the future, this will call your MoMo/Bank API to fetch the account name
            // For now, show a placeholder message after a delay to simulate API call
            
            if (value.length >= 10) {
                // Simulate API delay
                beneficiaryInput.value = 'Looking up...';
                
                setTimeout(() => {
                    // This is where you'll integrate your API call
                    // Example: fetchAccountName(value).then(name => beneficiaryInput.value = name);
                    beneficiaryInput.value = 'API Integration Pending';
                }, 500);
            }
        });
    }
});

// ========================================
// ADD RECIPIENT MODAL FUNCTIONS
// ========================================
function openAddRecipientModal() {
    const modal = document.getElementById('addRecipientModal');
    if (modal) {
        modal.classList.add('active');
        
        // Clear form
        document.getElementById('recipientName').value = '';
        document.getElementById('recipientAccount').value = '';
        document.getElementById('recipientType').value = '';
    }
}

function closeAddRecipientModal() {
    const modal = document.getElementById('addRecipientModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveRecipient() {
    const name = document.getElementById('recipientName').value.trim();
    const account = document.getElementById('recipientAccount').value.trim();
    const type = document.getElementById('recipientType').value;
    
    if (!name || !account || !type) {
        showAlert('⚠️ Please fill in all fields', 'warning', 4000);
        return;
    }
    
    // Here you would typically save to your backend/database
    // For now, we'll just show a success message and add to recent contacts
    
    // Create new contact avatar
    const contactsContainer = document.querySelector('.recent-contacts');
    const initials = name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    
    const newContact = document.createElement('div');
    newContact.className = 'contact-avatar';
    newContact.setAttribute('title', name);
    newContact.textContent = initials;
    
    // Add click handler
    newContact.addEventListener('click', function() {
        const accountInput = document.getElementById('accountInput');
        const beneficiaryInput = document.getElementById('beneficiaryName');
        if (accountInput && beneficiaryInput) {
            accountInput.value = account;
            beneficiaryInput.value = name;
            showAlert(`📱 ${name} selected for quick transfer`, 'info', 3000);
        }
    });
    
    // Add to contacts (limit to 5 visible contacts)
    if (contactsContainer.children.length >= 5) {
        contactsContainer.removeChild(contactsContainer.lastChild);
    }
    contactsContainer.insertBefore(newContact, contactsContainer.firstChild);
    
    showAlert(`✅ ${name} added to recipients!`, 'success', 4000);
    closeAddRecipientModal();
}

// ========================================
// SET GOAL MODAL FUNCTIONS
// ========================================
function openSetGoalModal() {
    const modal = document.getElementById('setGoalModal');
    if (modal) {
        modal.classList.add('active');
        
        // Pre-fill with current goal if available
        const currentGoal = document.querySelectorAll('.stat-card')[2];
        if (currentGoal) {
            const goalValue = currentGoal.querySelector('.stat-value').textContent.replace(/[₵,]/g, '');
            document.getElementById('goalAmount').value = goalValue;
        }
    }
}

function closeSetGoalModal() {
    const modal = document.getElementById('setGoalModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveGoal() {
    const amount = document.getElementById('goalAmount').value.trim();
    const period = document.getElementById('goalPeriod').value;
    
    if (!amount || parseFloat(amount) <= 0) {
        showAlert('⚠️ Please enter a valid goal amount', 'warning', 4000);
        return;
    }
    
    // Here you would typically save to your backend/database
    // For now, we'll update the UI
    
    const spendingGoalCard = document.querySelectorAll('.stat-card')[2];
    if (spendingGoalCard) {
        const goalValue = spendingGoalCard.querySelector('.stat-value');
        goalValue.textContent = `₵${parseFloat(amount).toLocaleString()}`;
    }
    
    const periodText = period === 'monthly' ? 'Monthly' : period === 'weekly' ? 'Weekly' : 'Daily';
    showAlert(`✅ ${periodText} spending goal set to ₵${parseFloat(amount).toLocaleString()}!`, 'success', 5000);
    
    // Add notification
    notifications.unshift({
        id: Date.now(),
        icon: '🎯',
        title: 'Goal Updated',
        message: `${periodText} spending goal set to ₵${parseFloat(amount).toLocaleString()}`,
        time: 'Just now',
        read: false,
        type: 'info'
    });
    
    updateNotificationBadge();
    closeSetGoalModal();
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const addRecipientModal = document.getElementById('addRecipientModal');
    const setGoalModal = document.getElementById('setGoalModal');
    
    if (e.target === addRecipientModal) {
        closeAddRecipientModal();
    }
    if (e.target === setGoalModal) {
        closeSetGoalModal();
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

// Optional: Add spinning effect to cedi loader
// Uncomment the line below if you want the spinning animation instead of pulsing
// document.querySelector('.cedi-loader')?.classList.add('spinning');

