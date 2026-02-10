// ============================================
// GLOBAL VARIABLES
// ============================================
let walletBalance = 0.00;
let transactions = [];
let beneficiaries = [];
let selectedElectricityType = null;
let balanceVisible = true;
const actualBalance = 0.00;

// ============================================
// LOADER
// ============================================
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
        
        // Load data and update UI after loader hides
        loadData();
        updateUI();
        
        // Set up event listeners after DOM is ready
        setupEventListeners();
    }, 300);
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // Sidebar toggle
    const hamburger = document.getElementById('hamburger');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when menu item clicked on mobile
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            });
        });
    }
}



// Balance Visibility Toggle
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
// SIDEBAR FUNCTIONS
// ============================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburger');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// ============================================
// DATA MANAGEMENT
// ============================================
function loadData() {
    // Load wallet balance
    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance) {
        walletBalance = parseFloat(savedBalance);
    }

    // Load transactions
    const savedTransactions = localStorage.getItem('utilityTransactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }

    // Load beneficiaries
    const savedBeneficiaries = localStorage.getItem('utilityBeneficiaries');
    if (savedBeneficiaries) {
        beneficiaries = JSON.parse(savedBeneficiaries);
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('utilityNotifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    }
}

function saveData() {
    localStorage.setItem('walletBalance', walletBalance.toString());
    localStorage.setItem('utilityTransactions', JSON.stringify(transactions));
    localStorage.setItem('utilityBeneficiaries', JSON.stringify(beneficiaries));
    localStorage.setItem('utilityNotifications', JSON.stringify(notifications));
}

function updateUI() {
    updateWalletBalance();
    updateTransactionList();
    updateBeneficiaryList();
    updateNotificationBadge();
}

function updateWalletBalance() {
    const balanceElement = document.getElementById('walletBalance');
    balanceElement.textContent = `₵${walletBalance.toFixed(2)}`;
}

// ============================================
// ELECTRICITY MODAL
// ============================================
function openElectricityModal() {
    document.getElementById('electricityModal').classList.add('active');
}

function closeElectricityModal() {
    document.getElementById('electricityModal').classList.remove('active');
    resetElectricityForm();
}

function updateElectricityType() {
    const provider = document.getElementById('electricityProvider').value;
    const typeGroup = document.getElementById('electricityTypeGroup');
    
    if (provider) {
        typeGroup.style.display = 'block';
    } else {
        typeGroup.style.display = 'none';
        hideElectricityFields();
    }
}

function selectElectricityType(type) {
    selectedElectricityType = type;
    
    // Update button states
    document.querySelectorAll('#electricityTypeGroup .type-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.type-btn').classList.add('selected');
    
    // Show remaining fields
    document.getElementById('meterNumberGroup').style.display = 'block';
    document.getElementById('electricityAmountGroup').style.display = 'block';
    document.getElementById('electricityPhoneGroup').style.display = 'block';
    document.getElementById('saveBeneficiaryCheckbox').style.display = 'block';
    
    // Update label based on type
    const label = document.getElementById('meterNumberLabel');
    if (type === 'prepaid') {
        label.textContent = 'Meter Number';
    } else {
        label.textContent = 'Account Number';
    }
}

function hideElectricityFields() {
    document.getElementById('meterNumberGroup').style.display = 'none';
    document.getElementById('electricityAmountGroup').style.display = 'none';
    document.getElementById('electricityPhoneGroup').style.display = 'none';
    document.getElementById('saveBeneficiaryCheckbox').style.display = 'none';
}

function validateMeterNumber() {
    const meterNumber = document.getElementById('electricityMeterNumber').value;
    const hint = document.getElementById('meterNumberHint');
    
    if (meterNumber.length > 0 && meterNumber.length < 10) {
        hint.textContent = 'Meter number should be at least 10 digits';
        hint.style.color = '#f44336';
    } else if (meterNumber.length >= 10) {
        hint.textContent = 'Valid meter number';
        hint.style.color = '#4CAF50';
    } else {
        hint.textContent = '';
    }
}

function setElectricityAmount(amount) {
    document.getElementById('electricityAmount').value = amount;
}

function resetElectricityForm() {
    document.getElementById('electricityProvider').value = '';
    document.getElementById('electricityMeterNumber').value = '';
    document.getElementById('electricityAmount').value = '';
    document.getElementById('electricityPhone').value = '';
    document.getElementById('saveElectricityBeneficiary').checked = false;
    selectedElectricityType = null;
    
    hideElectricityFields();
    document.getElementById('electricityTypeGroup').style.display = 'none';
    document.getElementById('meterNumberHint').textContent = '';
}

function processElectricityPayment() {
    const provider = document.getElementById('electricityProvider').value;
    const meterNumber = document.getElementById('electricityMeterNumber').value;
    const amount = parseFloat(document.getElementById('electricityAmount').value);
    const phone = document.getElementById('electricityPhone').value;
    const saveBeneficiary = document.getElementById('saveElectricityBeneficiary').checked;
    
    // Validation
    if (!provider) {
        showAlert('Please select a service provider', 'error');
        return;
    }
    
    if (!selectedElectricityType) {
        showAlert('Please select payment type (Prepaid or Postpaid)', 'error');
        return;
    }
    
    if (!meterNumber || meterNumber.length < 10) {
        showAlert('Please enter a valid meter/account number', 'error');
        return;
    }
    
    if (!amount || amount < 1) {
        showAlert('Please enter a valid amount', 'error');
        return;
    }
    
    if (amount > walletBalance) {
        showAlert('Insufficient wallet balance. Please fund your wallet.', 'error');
        return;
    }
    
    if (!phone) {
        showAlert('Please enter your phone number', 'error');
        return;
    }
    
    // Close modal and show loader
    closeElectricityModal();
    showCediLoader('Processing Electricity Payment...');
    
    // Simulate payment processing
    setTimeout(() => {
        // Deduct from wallet
        walletBalance -= amount;
        
        // Create transaction
        const transaction = {
            id: Date.now(),
            type: 'electricity',
            provider: provider === 'ecg' ? 'ECG' : 'NEDCo',
            paymentType: selectedElectricityType,
            meterNumber: meterNumber,
            amount: amount,
            phone: phone,
            date: new Date().toISOString(),
            status: 'completed'
        };
        
        transactions.unshift(transaction);
        
        // Save beneficiary if checked
        if (saveBeneficiary) {
            const beneficiary = {
                id: Date.now(),
                type: 'electricity',
                provider: provider === 'ecg' ? 'ECG' : 'NEDCo',
                paymentType: selectedElectricityType,
                meterNumber: meterNumber,
                nickname: `${provider === 'ecg' ? 'ECG' : 'NEDCo'} - ${meterNumber.slice(-4)}`
            };
            
            beneficiaries.push(beneficiary);
        }
        
        // Add notification
        addNotification(
            'success',
            'Electricity Bill Paid',
            `₵${amount.toFixed(2)} paid to ${transaction.provider}`
        );
        
        // Save data and update UI
        saveData();
        updateUI();
        
        hideCediLoader();
        showAlert(`✅ Electricity bill payment of ₵${amount.toFixed(2)} successful!${selectedElectricityType === 'prepaid' ? ' Token will be sent to your phone.' : ''}`, 'success');
        
    }, 2500);
}

// ============================================
// WATER MODAL
// ============================================
function openWaterModal() {
    document.getElementById('waterModal').classList.add('active');
}

function closeWaterModal() {
    document.getElementById('waterModal').classList.remove('active');
    resetWaterForm();
}

function updateWaterFields() {
    const provider = document.getElementById('waterProvider').value;
    
    if (provider) {
        document.getElementById('waterAccountGroup').style.display = 'block';
        document.getElementById('waterRegionGroup').style.display = 'block';
        document.getElementById('waterAmountGroup').style.display = 'block';
        document.getElementById('waterPhoneGroup').style.display = 'block';
        document.getElementById('saveWaterBeneficiaryCheckbox').style.display = 'block';
    } else {
        hideWaterFields();
    }
}

function hideWaterFields() {
    document.getElementById('waterAccountGroup').style.display = 'none';
    document.getElementById('waterRegionGroup').style.display = 'none';
    document.getElementById('waterAmountGroup').style.display = 'none';
    document.getElementById('waterPhoneGroup').style.display = 'none';
    document.getElementById('saveWaterBeneficiaryCheckbox').style.display = 'none';
}

function setWaterAmount(amount) {
    document.getElementById('waterAmount').value = amount;
}

function resetWaterForm() {
    document.getElementById('waterProvider').value = '';
    document.getElementById('waterAccountNumber').value = '';
    document.getElementById('waterRegion').value = '';
    document.getElementById('waterAmount').value = '';
    document.getElementById('waterPhone').value = '';
    document.getElementById('saveWaterBeneficiary').checked = false;
    hideWaterFields();
}

function processWaterPayment() {
    const provider = document.getElementById('waterProvider').value;
    const accountNumber = document.getElementById('waterAccountNumber').value;
    const region = document.getElementById('waterRegion').value;
    const amount = parseFloat(document.getElementById('waterAmount').value);
    const phone = document.getElementById('waterPhone').value;
    const saveBeneficiary = document.getElementById('saveWaterBeneficiary').checked;
    
    // Validation
    if (!provider) {
        showAlert('Please select a service provider', 'error');
        return;
    }
    
    if (!accountNumber) {
        showAlert('Please enter your account number', 'error');
        return;
    }
    
    if (!region) {
        showAlert('Please select your region', 'error');
        return;
    }
    
    if (!amount || amount < 1) {
        showAlert('Please enter a valid amount', 'error');
        return;
    }
    
    if (amount > walletBalance) {
        showAlert('Insufficient wallet balance. Please fund your wallet.', 'error');
        return;
    }
    
    if (!phone) {
        showAlert('Please enter your phone number', 'error');
        return;
    }
    
    // Close modal and show loader
    closeWaterModal();
    showCediLoader('Processing Water Bill Payment...');
    
    // Simulate payment processing
    setTimeout(() => {
        // Deduct from wallet
        walletBalance -= amount;
        
        // Create transaction
        const providerName = provider === 'gwcl' ? 'GWCL' : provider === 'avrl' ? 'AVRL' : 'Local Provider';
        const transaction = {
            id: Date.now(),
            type: 'water',
            provider: providerName,
            accountNumber: accountNumber,
            region: region,
            amount: amount,
            phone: phone,
            date: new Date().toISOString(),
            status: 'completed'
        };
        
        transactions.unshift(transaction);
        
        // Save beneficiary if checked
        if (saveBeneficiary) {
            const beneficiary = {
                id: Date.now(),
                type: 'water',
                provider: providerName,
                accountNumber: accountNumber,
                region: region,
                nickname: `${providerName} - ${accountNumber.slice(-4)}`
            };
            
            beneficiaries.push(beneficiary);
        }
        
        // Add notification
        addNotification(
            'success',
            'Water Bill Paid',
            `₵${amount.toFixed(2)} paid to ${providerName}`
        );
        
        // Save data and update UI
        saveData();
        updateUI();
        
        hideCediLoader();
        showAlert(`✅ Water bill payment of ₵${amount.toFixed(2)} successful!`, 'success');
        
    }, 2500);
}

// ============================================
// WASTE MODAL
// ============================================
// function openWasteModal() {
//     document.getElementById('wasteModal').classList.add('active');
// }

// function closeWasteModal() {
//     document.getElementById('wasteModal').classList.remove('active');
//     resetWasteForm();
// }

// function updateWasteFields() {
//     const provider = document.getElementById('wasteProvider').value;
    
//     if (provider) {
//         document.getElementById('wasteAccountGroup').style.display = 'block';
//         document.getElementById('wasteLocationGroup').style.display = 'block';
//         document.getElementById('wastePlanGroup').style.display = 'block';
//         document.getElementById('wastePhoneGroup').style.display = 'block';
//         document.getElementById('saveWasteBeneficiaryCheckbox').style.display = 'block';
//     } else {
//         hideWasteFields();
//     }
// }

// function hideWasteFields() {
//     document.getElementById('wasteAccountGroup').style.display = 'none';
//     document.getElementById('wasteLocationGroup').style.display = 'none';
//     document.getElementById('wastePlanGroup').style.display = 'none';
//     document.getElementById('wasteAmountGroup').style.display = 'none';
//     document.getElementById('wastePhoneGroup').style.display = 'none';
//     document.getElementById('saveWasteBeneficiaryCheckbox').style.display = 'none';
// }

// function updateWasteAmount() {
//     const plan = document.getElementById('wastePlan');
//     const selectedOption = plan.options[plan.selectedIndex];
//     const amount = selectedOption.getAttribute('data-amount');
    
//     if (amount) {
//         document.getElementById('wasteAmount').value = amount;
//         document.getElementById('wasteAmountGroup').style.display = 'block';
//     } else {
//         document.getElementById('wasteAmountGroup').style.display = 'none';
//     }
// }

// function resetWasteForm() {
//     document.getElementById('wasteProvider').value = '';
//     document.getElementById('wasteAccountNumber').value = '';
//     document.getElementById('wasteLocation').value = '';
//     document.getElementById('wastePlan').value = '';
//     document.getElementById('wasteAmount').value = '';
//     document.getElementById('wastePhone').value = '';
//     document.getElementById('saveWasteBeneficiary').checked = false;
//     hideWasteFields();
// }

// function processWastePayment() {
//     const provider = document.getElementById('wasteProvider').value;
//     const accountNumber = document.getElementById('wasteAccountNumber').value;
//     const location = document.getElementById('wasteLocation').value;
//     const plan = document.getElementById('wastePlan');
//     const planText = plan.options[plan.selectedIndex].text;
//     const amount = parseFloat(document.getElementById('wasteAmount').value);
//     const phone = document.getElementById('wastePhone').value;
//     const saveBeneficiary = document.getElementById('saveWasteBeneficiary').checked;
    
//     // Validation
//     if (!provider) {
//         showAlert('Please select a service provider', 'error');
//         return;
//     }
    
//     if (!accountNumber) {
//         showAlert('Please enter your account/customer number', 'error');
//         return;
//     }
    
//     if (!location) {
//         showAlert('Please enter your location', 'error');
//         return;
//     }
    
//     if (!plan.value) {
//         showAlert('Please select a service plan', 'error');
//         return;
//     }
    
//     if (!amount || amount < 1) {
//         showAlert('Please enter a valid amount', 'error');
//         return;
//     }
    
//     if (amount > walletBalance) {
//         showAlert('Insufficient wallet balance. Please fund your wallet.', 'error');
//         return;
//     }
    
//     if (!phone) {
//         showAlert('Please enter your phone number', 'error');
//         return;
//     }
    
//     // Close modal and show loader
//     closeWasteModal();
//     showCediLoader('Processing Waste Bill Payment...');
    
//     // Simulate payment processing
//     setTimeout(() => {
//         // Deduct from wallet
//         walletBalance -= amount;
        
//         // Create transaction
//         const providerName = provider === 'zoomlion' ? 'Zoomlion' : 
//                             provider === 'jekora' ? 'Jekora' : 
//                             provider === 'city-waste' ? 'City Waste' : 'Other Provider';
        
//         const transaction = {
//             id: Date.now(),
//             type: 'waste',
//             provider: providerName,
//             accountNumber: accountNumber,
//             location: location,
//             plan: planText,
//             amount: amount,
//             phone: phone,
//             date: new Date().toISOString(),
//             status: 'completed'
//         };
        
//         transactions.unshift(transaction);
        
//         // Save beneficiary if checked
//         if (saveBeneficiary) {
//             const beneficiary = {
//                 id: Date.now(),
//                 type: 'waste',
//                 provider: providerName,
//                 accountNumber: accountNumber,
//                 location: location,
//                 nickname: `${providerName} - ${location}`
//             };
            
//             beneficiaries.push(beneficiary);
//         }
        
//         // Add notification
//         addNotification(
//             'success',
//             'Waste Bill Paid',
//             `₵${amount.toFixed(2)} paid to ${providerName}`
//         );
        
//         // Save data and update UI
//         saveData();
//         updateUI();
        
//         hideCediLoader();
//         showAlert(`✅ Waste management payment of ₵${amount.toFixed(2)} successful!`, 'success');
        
//     }, 2500);
// }

// ============================================
// TRANSACTION MANAGEMENT
// ============================================
function updateTransactionList() {
    const listElement = document.getElementById('transactionList');
    
    if (transactions.length === 0) {
        listElement.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💳</div>
                <p>No transactions yet</p>
                <span>Your utility payments will appear here</span>
            </div>
        `;
        return;
    }
    
    listElement.innerHTML = transactions.map(transaction => {
        const icon = transaction.type === 'electricity' ? '⚡' : 
                     transaction.type === 'water' ? '💧' : '🗑️';
        
        const title = transaction.type === 'electricity' ? `Electricity - ${transaction.provider}` :
                      transaction.type === 'water' ? `Water - ${transaction.provider}` :
                      `Waste - ${transaction.provider}`;
        
        const date = new Date(transaction.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="transaction-item">
                <div class="transaction-icon ${transaction.type}">${icon}</div>
                <div class="transaction-details">
                    <div class="transaction-title">${title}</div>
                    <div class="transaction-meta">${dateStr} • ${timeStr}</div>
                </div>
                <div>
                    <div class="transaction-amount">-₵${transaction.amount.toFixed(2)}</div>
                    <span class="transaction-status status-${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterTransactions(type) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const listElement = document.getElementById('transactionList');
    
    let filteredTransactions = transactions;
    if (type !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === type);
    }
    
    if (filteredTransactions.length === 0) {
        listElement.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💳</div>
                <p>No ${type === 'all' ? '' : type} transactions yet</p>
                <span>Your payments will appear here</span>
            </div>
        `;
        return;
    }
    
    listElement.innerHTML = filteredTransactions.map(transaction => {
        const icon = transaction.type === 'electricity' ? '⚡' : 
                     transaction.type === 'water' ? '💧' : '🗑️';
        
        const title = transaction.type === 'electricity' ? `Electricity - ${transaction.provider}` :
                      transaction.type === 'water' ? `Water - ${transaction.provider}` :
                      `Waste - ${transaction.provider}`;
        
        const date = new Date(transaction.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="transaction-item">
                <div class="transaction-icon ${transaction.type}">${icon}</div>
                <div class="transaction-details">
                    <div class="transaction-title">${title}</div>
                    <div class="transaction-meta">${dateStr} • ${timeStr}</div>
                </div>
                <div>
                    <div class="transaction-amount">-₵${transaction.amount.toFixed(2)}</div>
                    <span class="transaction-status status-${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// BENEFICIARY MANAGEMENT
// ============================================
function updateBeneficiaryList() {
    const listElement = document.getElementById('beneficiaryList');
    
    if (beneficiaries.length === 0) {
        listElement.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No saved beneficiaries yet</p>
                <span>Make a payment to save beneficiary details</span>
            </div>
        `;
        return;
    }
    
    listElement.innerHTML = beneficiaries.map(beneficiary => {
        const icon = beneficiary.type === 'electricity' ? '⚡' : 
                     beneficiary.type === 'water' ? '💧' : '🗑️';
        
        const iconClass = beneficiary.type === 'electricity' ? 'electricity' : 
                          beneficiary.type === 'water' ? 'water' : 'waste';
        
        const details = beneficiary.type === 'electricity' ? 
                       `Meter: ${beneficiary.meterNumber} • ${beneficiary.paymentType}` :
                       beneficiary.type === 'water' ? 
                       `Account: ${beneficiary.accountNumber} • ${beneficiary.region}` :
                       `${beneficiary.location}`;
        
        return `
            <div class="beneficiary-item" onclick="payBeneficiary(${beneficiary.id})">
                <div class="beneficiary-header">
                    <div class="beneficiary-icon utility-icon ${iconClass}">${icon}</div>
                    <div class="beneficiary-info">
                        <h4>${beneficiary.nickname}</h4>
                        <p>${beneficiary.provider}</p>
                    </div>
                </div>
                <div class="beneficiary-details">${details}</div>
            </div>
        `;
    }).join('');
}

function payBeneficiary(beneficiaryId) {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    
    if (!beneficiary) return;
    
    // Open appropriate modal and pre-fill details
    if (beneficiary.type === 'electricity') {
        openElectricityModal();
        document.getElementById('electricityProvider').value = 
            beneficiary.provider === 'ECG' ? 'ecg' : 'nedco';
        updateElectricityType();
        
        // Simulate type selection
        setTimeout(() => {
            selectElectricityType(beneficiary.paymentType);
            document.getElementById('electricityMeterNumber').value = beneficiary.meterNumber;
        }, 100);
    } else if (beneficiary.type === 'water') {
        openWaterModal();
        document.getElementById('waterProvider').value = 
            beneficiary.provider === 'GWCL' ? 'gwcl' : 
            beneficiary.provider === 'AVRL' ? 'avrl' : 'other';
        updateWaterFields();
        document.getElementById('waterAccountNumber').value = beneficiary.accountNumber;
        document.getElementById('waterRegion').value = beneficiary.region;
    }    
        //  else if (beneficiary.type === 'waste') {
    //     openWasteModal();
    //     const providerMap = {
    //         'Zoomlion': 'zoomlion',
    //         'Jekora': 'jekora',
    //         'City Waste': 'city-waste'
    //     };
    //     document.getElementById('wasteProvider').value = providerMap[beneficiary.provider] || 'other';
    //     updateWasteFields();
    //     document.getElementById('wasteAccountNumber').value = beneficiary.accountNumber;
    //     document.getElementById('wasteLocation').value = beneficiary.location;
    // }
}

function toggleBeneficiaryView() {
    // Could implement grid/list view toggle
    showAlert('View options coming soon!', 'info');
}

// ============================================
// CEDI LOADER
// ============================================
function showCediLoader(text = 'Processing Payment...') {
    const loader = document.getElementById('cediLoader');
    const loaderText = document.getElementById('loaderText');
    
    if (loader && loaderText) {
        loaderText.textContent = text;
        loader.classList.add('active');
    }
}

function hideCediLoader() {
    const loader = document.getElementById('cediLoader');
    if (loader) {
        loader.classList.remove('active');
    }
}

// ============================================
// ALERT SYSTEM
// ============================================
function showAlert(message, type = 'success', duration = 5000) {
    let container = document.getElementById('alertContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alertContainer';
        container.className = 'alert-container';
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

// ============================================
// NOTIFICATION SYSTEM (Airtime Style)
// ============================================
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


function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Close notification panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notificationPanel');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (panel && notificationBtn && 
        !panel.contains(e.target) && 
        !notificationBtn.contains(e.target) &&
        panel.classList.contains('active')) {
        panel.classList.remove('active');
    }
});

// Prevent modal content clicks from closing modal
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});