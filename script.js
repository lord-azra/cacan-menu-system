let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function init() {

    const res = await fetch("./data/menu.json");
    const data = await res.json();

    const container = document.getElementById("menu-container");
    const nav = document.getElementById("category-nav");

    container.innerHTML = "";
    nav.innerHTML = "";

    data.categories.forEach(cat => {

        const link = document.createElement("a");
        link.href = "#" + cat.id;
        link.textContent = cat.title;
        nav.appendChild(link);

        const section = document.createElement("section");
        section.id = cat.id;

        cat.items.forEach(item => {

            const card = document.createElement("div");
            card.className = "product-card";

            card.onclick = () => addToCart(item);

            card.innerHTML = `
                <div>${item.name}</div>
                <div>${item.price} ₺</div>
            `;

            section.appendChild(card);
        });

        container.appendChild(section);
    });

    renderCart();
}

function addToCart(item) {

    let found = cart.find(x => x.sku === item.sku);

    if (found) {
        found.qty++;
    } else {
        cart.push({
            sku: item.sku,
            name: item.name,
            price: item.price,
            qty: 1
        });
    }

    renderCart();
}

function changeQty(sku, value) {

    let item = cart.find(x => x.sku === sku);

    if (!item) return;

    item.qty += value;

    if (item.qty <= 0) {
        cart = cart.filter(x => x.sku !== sku);
    }

    renderCart();
}

function removeItem(sku) {
    cart = cart.filter(x => x.sku !== sku);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

function renderCart() {

    let box = document.getElementById("cart-items");
    let count = 0;
    let total = 0;

    box.innerHTML = "";

    cart.forEach(item => {

        count += item.qty;
        total += item.qty * item.price;

        let div = document.createElement("div");

        div.innerHTML = `
            ${item.name}
            x${item.qty}
            <button onclick="changeQty('${item.sku}', -1)">-</button>
            <button onclick="changeQty('${item.sku}', 1)">+</button>
            <button onclick="removeItem('${item.sku}')">🗑</button>
        `;

        box.appendChild(div);
    });

    document.getElementById("cart-count").innerText = count;
    document.getElementById("total-price").innerText = total + " ₺";

    localStorage.setItem("cart", JSON.stringify(cart));
}

function sendOrder() {

    const table = document.getElementById("tableNo").value;

    if (!table) {
        alert("Masa numarası gir!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const total = cart.reduce((a,b) => a + b.price * b.qty, 0);

    orders.push({
        table: table,
        items: cart,
        total: total,
        time: Date.now()
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    renderCart();

    alert("Sipariş gönderildi!");
}

init();
