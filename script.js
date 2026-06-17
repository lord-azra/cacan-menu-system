let cart = JSON.parse(localStorage.getItem("cart")) || [];
let menuData = null;

async function init() {

    try {

        const res = await fetch("./data/menu.json");
        menuData = await res.json();

        renderMenu(menuData.categories);
        renderCart();

        document.getElementById("searchInput")
            .addEventListener("input", searchProducts);

    } catch (err) {
        console.error(err);
        document.getElementById("menu-container")
            .innerHTML = "Menü yüklenemedi";
    }
}

function renderMenu(categories) {

    const container = document.getElementById("menu-container");
    const nav = document.getElementById("category-nav");

    container.innerHTML = "";
    nav.innerHTML = "";

    categories.forEach(cat => {

        const link = document.createElement("a");
        link.href = "#" + cat.id;
        link.textContent = cat.title;
        nav.appendChild(link);

        const section = document.createElement("section");
        section.id = cat.id;

        cat.items.forEach(item => {

            const div = document.createElement("div");
            div.className = "product-card";

            div.innerHTML = `
                <div>${item.name}</div>
                <div>${item.price} ₺</div>
            `;

            div.onclick = () => addToCart(item);

            section.appendChild(div);
        });

        container.appendChild(section);
    });
}

function searchProducts() {

    const text = document.getElementById("searchInput").value.toLowerCase();

    const filtered = menuData.categories.map(cat => ({
        ...cat,
        items: cat.items.filter(i =>
            i.name.toLowerCase().includes(text)
        )
    }));

    renderMenu(filtered);
}

function addToCart(item) {

    let found = cart.find(x => x.sku === item.sku);

    if (found) found.qty++;
    else cart.push({ ...item, qty: 1 });

    renderCart();
}

function changeQty(sku, val) {

    let item = cart.find(x => x.sku === sku);

    if (!item) return;

    item.qty += val;

    if (item.qty <= 0)
        cart = cart.filter(x => x.sku !== sku);

    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

function renderCart() {

    const box = document.getElementById("cart-items");

    let total = 0;
    let count = 0;

    box.innerHTML = "";

    cart.forEach(item => {

        total += item.price * item.qty;
        count += item.qty;

        const div = document.createElement("div");

        div.innerHTML = `
            ${item.name} x${item.qty}
            <button onclick="changeQty('${item.sku}', -1)">-</button>
            <button onclick="changeQty('${item.sku}', 1)">+</button>
        `;

        box.appendChild(div);
    });

    document.getElementById("cart-count").innerText = count + " Ürün";
    document.getElementById("total-price").innerText = total + " ₺";

    localStorage.setItem("cart", JSON.stringify(cart));
}

function sendWhatsApp() {

    const table = document.getElementById("tableNo").value;

    if (!table) return alert("Masa no gir!");

    let msg = "Sipariş\nMasa: " + table + "\n\n";

    let total = 0;

    cart.forEach(i => {
        msg += i.name + " x" + i.qty + "\n";
        total += i.price * i.qty;
    });

    msg += "\nToplam: " + total;

    const phone = "90XXXXXXXXXX";

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    );

    clearCart();
}

init();
