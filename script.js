let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isSending = false;

async function init() {

    const container = document.getElementById("menu-container");
    const nav = document.getElementById("category-nav");

    try {
        const response = await fetch("./data/menu.json");
        if (!response.ok) throw new Error("JSON yüklenemedi");

        const data = await response.json();

        container.innerHTML = "";
        nav.innerHTML = "";

        data.categories
            .sort((a, b) => a.order - b.order)
            .forEach(category => {

                const navLink = document.createElement("a");
                navLink.href = `#${category.id}`;
                navLink.textContent = category.title;
                nav.appendChild(navLink);

                const section = document.createElement("section");
                section.id = category.id;

                section.innerHTML = `<h2 class="category-title">${category.title}</h2>`;

                category.items.forEach(item => {

                    const card = document.createElement("div");
                    card.className = "product-card";
                    card.style.cursor = "pointer";

                    card.onclick = () => {
                        addToCart(item.sku, item.name, item.price);
                    };

                    card.innerHTML = `
                        <div>
                            <div class="product-name">${item.name}</div>
                            ${item.tag ? `<span class="tag">${item.tag}</span>` : ""}
                        </div>

                        <div class="price">${item.price} ₺</div>
                    `;

                    section.appendChild(card);
                });

                container.appendChild(section);
            });

    } catch (error) {
        console.error(error);
        container.innerHTML = "Menü yüklenemedi";
    }

    renderCart();
}

function addToCart(sku, name, price) {

    const item = cart.find(x => x.sku === sku);

    if (item) {
        item.qty++;
    } else {
        cart.push({ sku, name, price, qty: 1 });
    }

    renderCart();
}

function changeQty(sku, value) {

    const item = cart.find(x => x.sku === sku);

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

    const cartItems = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    const total = document.getElementById("total-price");

    if (!cartItems || !count || !total) return;

    cartItems.innerHTML = "";

    let totalPrice = 0;
    let totalCount = 0;

    cart.forEach(item => {

        totalPrice += item.price * item.qty;
        totalCount += item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <span>${item.name}</span>

            <div class="cart-controls">
                <button onclick="changeQty('${item.sku}', -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty('${item.sku}', 1)">+</button>

                <button onclick="removeItem('${item.sku}')">🗑</button>
            </div>
        `;

        cartItems.appendChild(div);
    });

    count.textContent = totalCount + " Ürün";
    total.textContent = totalPrice + " ₺";

    localStorage.setItem("cart", JSON.stringify(cart));
}

function getTableNo() {

    const input = document.getElementById("tableNo");
    const text = document.getElementById("tableText");

    // input varsa onu al
    if (input && input.value.trim() !== "") {
        return input.value;
    }

    // alternatif yazı alanı varsa onu al
    if (text && text.value.trim() !== "") {
        return text.value;
    }

    return null;
}

function sendWhatsApp() {

    if (isSending) return;
    isSending = true;

    const table = getTableNo();

    if (!table) {
        alert("Masa numarası gir!");
        isSending = false;
        return;
    }

    let msg = `🍽️ SİPARİŞ\nMasa: ${table}\n\n`;
    let total = 0;

    cart.forEach(i => {
        msg += `- ${i.name} x${i.qty} = ${i.price * i.qty} ₺\n`;
        total += i.price * i.qty;
    });

    msg += `\nTOPLAM: ${total} ₺`;

    const phone = "905316753924";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);

    setTimeout(() => isSending = false, 2000);
}

init();
