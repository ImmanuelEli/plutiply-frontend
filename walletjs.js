 let balanceVisible = true;
        const actualBalance = '₵54,812.00';

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

            // Show/hide card fields based on selection
            const methodName = element.querySelector('h4').textContent;
            const cardFields = document.getElementById('cardFields');
            const cardExtraFields = document.getElementById('cardExtraFields');

            if (methodName === 'Debit/Credit Card') {
                cardFields.style.display = 'block';
                cardExtraFields.style.display = 'grid';
            } else {
                cardFields.style.display = 'none';
                cardExtraFields.style.display = 'none';
            }
        }

        // Process funding
        function processFunding() {
            const amount = document.getElementById('fundAmount').value;
            
            if (!amount || amount < 10) {
                alert('Please enter an amount of at least ₵10');
                return;
            }

            alert(`Processing payment of ₵${amount}...\n\nThis will be connected to Paystack/Hubtel API in the backend.`);
            closeFundModal();
        }

        // Process withdrawal
        function processWithdrawal() {
            alert('Withdrawal request submitted!\n\nThis will be processed by the backend and admin approval.');
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

        // Quick action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', function() {
                const action = this.querySelector('h3').textContent;
                alert(`Navigating to ${action} page...`);
            });
        });

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
        const MIN_LOADER_TIME = 2000; // 3 cycles × 1s
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