// ===== PET FOOD STORE ADMIN DASHBOARD =====

// Initialize sample orders if empty
let storedOrders = JSON.parse(localStorage.getItem('scoopland_orders'));
if (!storedOrders || storedOrders.length === 0) {
    storedOrders = [
        {
            id: "PL-84920194",
            customer: "Fatima Al-Kuwari",
            phone: "+974 7756 8080",
            address: "Villa 14, West Bay Lagoon, Doha",
            notes: "Ring bell twice, cats waiting!",
            items: [
                {
                    key: "1_box_Gravy",
                    id: 1,
                    name: "Plaisir Salmon & Cod in Gravy",
                    price: 17.00,
                    image: "cat-food-salmon.png",
                    qty: 2,
                    size: "box",
                    vessel: "Chunks in Gravy",
                    toppings: ["Wild Salmon Oil Drizzle"]
                },
                {
                    key: "5_dry",
                    id: 5,
                    name: "Delight 2.2 KGS Dry Cat Sea Food",
                    price: 25.00,
                    image: "cat-food-dry.png",
                    qty: 1,
                    size: "bag",
                    vessel: "Dry Kibble",
                    toppings: []
                }
            ],
            total: 59.00,
            status: "Packing",
            timestamp: new Date().toLocaleString()
        },
        {
            id: "PL-51930281",
            customer: "Nasser Al-Attiyah",
            phone: "+974 5512 3456",
            address: "Tower 22, Porto Arabia, The Pearl, Doha",
            notes: "Leave with building reception",
            items: [
                {
                    key: "2_carton_Gravy",
                    id: 2,
                    name: "Plaisir Beef & Turkey in Gravy",
                    price: 39.00,
                    image: "cat-food-beef.png",
                    qty: 1,
                    size: "carton",
                    vessel: "Chunks in Gravy",
                    toppings: ["Dental Health Bites"]
                }
            ],
            total: 41.50,
            status: "On the Way",
            timestamp: new Date(Date.now() - 3600000).toLocaleString()
        }
    ];
    localStorage.setItem('scoopland_orders', JSON.stringify(storedOrders));
}

let orders = storedOrders;

// DOM Elements
const revenueMetric = document.getElementById('revenueMetric');
const ordersMetric = document.getElementById('ordersMetric');
const activeMetric = document.getElementById('activeMetric');
const topFlavorMetric = document.getElementById('topFlavorMetric');

const orderSearch = document.getElementById('orderSearch');
const adminFilterPills = document.getElementById('adminFilterPills');
const ordersTable = document.getElementById('ordersTable');
const ordersTableBody = document.getElementById('ordersTableBody');
const ordersEmptyState = document.getElementById('ordersEmptyState');

const updateMetrics = () => {
    const totalRev = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    if (revenueMetric) revenueMetric.textContent = `QAR ${totalRev.toFixed(2)}`;

    if (ordersMetric) ordersMetric.textContent = orders.length;

    const activeCount = orders.filter(o => o.status !== 'Delivered').length;
    if (activeMetric) activeMetric.textContent = activeCount;

    const itemSales = {};
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemSales[item.name] = (itemSales[item.name] || 0) + item.qty;
            });
        }
    });

    let topItem = 'Plaisir Salmon';
    let maxSales = 0;
    for (const [name, sales] of Object.entries(itemSales)) {
        if (sales > maxSales) {
            maxSales = sales;
            topItem = name;
        }
    }
    
    if (topFlavorMetric) {
        topFlavorMetric.textContent = maxSales > 0 ? `${topItem} (${maxSales})` : 'Plaisir Salmon';
    }
};

const renderOrders = () => {
    const searchQuery = orderSearch ? orderSearch.value.toLowerCase().trim() : '';
    const activePill = adminFilterPills ? adminFilterPills.querySelector('.filter-pill.active') : null;
    const filterStatus = activePill ? activePill.dataset.filter : 'all';

    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = '';

    const filteredOrders = orders.filter(order => {
        const custName = typeof order.customer === 'string' ? order.customer : (order.customer?.name || '');
        const custPhone = order.phone || order.customer?.phone || '';
        const custAddr = order.address || order.customer?.address || '';
        
        const matchesSearch = 
            order.id.toLowerCase().includes(searchQuery) ||
            custName.toLowerCase().includes(searchQuery) ||
            custPhone.includes(searchQuery) ||
            custAddr.toLowerCase().includes(searchQuery);

        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (filteredOrders.length === 0) {
        if (ordersTable) ordersTable.style.display = 'none';
        if (ordersEmptyState) ordersEmptyState.style.display = 'block';
    } else {
        if (ordersTable) ordersTable.style.display = 'table';
        if (ordersEmptyState) ordersEmptyState.style.display = 'none';

        filteredOrders.forEach(order => {
            const custName = typeof order.customer === 'string' ? order.customer : (order.customer?.name || 'Customer');
            const custPhone = order.phone || order.customer?.phone || '';
            const custAddr = order.address || order.customer?.address || '';
            const notes = order.notes || order.customer?.notes || '';

            let itemsHTML = '<ul style="list-style: none; padding: 0; margin: 0; font-size: 12.5px;">';
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const addons = item.toppings && item.toppings.length > 0 ? ` (+${item.toppings.join(', ')})` : '';
                    itemsHTML += `
                        <li style="margin-bottom: 4px;">
                            <strong>${item.qty}x</strong> ${item.name} <span style="color: var(--gray);">${addons}</span>
                        </li>
                    `;
                });
            }
            itemsHTML += '</ul>';

            const notesHTML = notes ? `<div style="font-size: 11px; color: var(--secondary); margin-top: 4px;">📝 Note: "${notes}"</div>` : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong style="color: var(--primary);">${order.id}</strong><br>
                    <small style="color: var(--gray);">${order.timestamp || ''}</small>
                </td>
                <td>
                    <strong>${custName}</strong><br>
                    <small style="color: var(--gray);">${custPhone}</small><br>
                    <small style="color: var(--charcoal);">${custAddr}</small>
                    ${notesHTML}
                </td>
                <td>${itemsHTML}</td>
                <td><strong style="color: var(--primary);">QAR ${(order.total || 0).toFixed(2)}</strong></td>
                <td>
                    <select class="status-select" onchange="changeOrderStatus('${order.id}', this.value)">
                        <option value="Ordered" ${order.status === 'Ordered' ? 'selected' : ''}>Ordered ⏳</option>
                        <option value="Packing" ${order.status === 'Packing' ? 'selected' : ''}>Packing 📦</option>
                        <option value="On the Way" ${order.status === 'On the Way' ? 'selected' : ''}>On the Way 🚚</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered 🐱</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteOrder('${order.id}')" style="background: none; border: none; font-size: 16px; cursor: pointer;" title="Delete order">🗑️</button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    }

    updateMetrics();
};

window.changeOrderStatus = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('scoopland_orders', JSON.stringify(orders));
        renderOrders();
    }
};

window.deleteOrder = (orderId) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('scoopland_orders', JSON.stringify(orders));
        renderOrders();
    }
};

if (orderSearch) {
    orderSearch.addEventListener('input', renderOrders);
}

if (adminFilterPills) {
    adminFilterPills.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-pill')) {
            adminFilterPills.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
            e.target.classList.add('active');
            renderOrders();
        }
    });
}

renderOrders();

window.addEventListener('storage', (e) => {
    if (e.key === 'scoopland_orders') {
        orders = JSON.parse(localStorage.getItem('scoopland_orders')) || [];
        renderOrders();
    }
});
