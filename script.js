let cart = JSON.parse(localStorage.getItem("cart")) || [];
let menuData = null;

async function init() {
    try {
        const res = await fetch("./data/menu.json");
        menuData = await res.json();
        renderNav(menuData.categories);
        renderMenu(menuData.categories);
        renderCart();
        document.getElementById("searchInput").addEventListener("input", searchProducts);
    } catch (err) {
        document.getElementById("menu-container").innerHTML = "Menü yüklenemedi.";
    }
}

function renderNav(categories) {
    const nav = document.getElementById("category-nav");
    nav.innerHTML = "";
    categories.forEach(cat => {
        const link = document.createElement("a");
        link.href = "#" + cat.id;
        link.textContent = cat.title;
        nav.appendChild(link);
    });
}

function renderMenu(categories) {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";
    categories.forEach(cat => {
        const section = document.createElement("section");
        section.id = cat.id;
        section.innerHTML = `<h2>${cat.title}</h2>`;
        cat.items.forEach(item => {
            // HATA DÜZELTİLDİ: Artık available olmayanları gizliyor, olanları gösteriyor.
            if (!item.available) return; 
            
            const div = document.createElement("div");
            div.className = "product-card";
            div.innerHTML = `
                <div><strong>${item.name}</strong><br>${item.price} ₺</div>
                <button onclick='addToCart(${JSON.stringify(item).replace(/"/g, "&quot;")})' class="add-btn">➕ Ekle</button>
            `;
            section.appendChild(div);
        });
        container.appendChild(section);
    });
}

function searchProducts(e) {
    const text = e.target.value.toLowerCase();
    const filtered = menuData.categories.map(cat => ({
        ...cat, items: cat.items.filter(i => i.name.toLowerCase().includes(text))
    }));
    renderMenu(filtered);
}

function addToCart(item) {
    let found = cart.find(x => x.sku === item.sku);
    found ? found.qty++ : cart.push({ ...item, qty: 1 });
    renderCart();
}

function changeQty(sku, val) {
    let item = cart.find(x => x.sku === sku);
    if (!item) return;
    item.qty += val;
    if (item.qty <= 0) cart = cart.filter(x => x.sku !== sku);
    renderCart();
}

function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
}

function renderCart() {
    const box = document.getElementById("cart-items");
    box.innerHTML = "";
    let total = 0, count = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        const div = document.createElement("div");
        div.style.marginBottom = "5px";
        div.innerHTML = `${item.name} (${item.price} ₺) x${item.qty} 
        <button onclick="changeQty('${item.sku}', -1)" style="width:auto; padding:2px 8px">-</button>
        <button onclick="changeQty('${item.sku}', 1)" style="width:auto; padding:2px 8px">+</button>`;
        box.appendChild(div);
    });
    document.getElementById("cart-count").innerText = count + " Ürün";
    document.getElementById("total-price").innerText = total + " ₺";
    localStorage.setItem("cart", JSON.stringify(cart));
}

function sendWhatsApp() {
    const table = document.getElementById("tableNo");
    if (cart.length === 0) return alert("Sepet boş!");
    if (!table.value) {
        table.focus();
        return alert("Lütfen masa numaranızı girin!");
    }
    let msg = `Sipariş\nMasa: ${table.value}\n\n`;
    cart.forEach(i => msg += `${i.name} x${i.qty} (${i.price * i.qty}₺)\n`);
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    msg += `\n*Toplam Tutar: ${total} ₺*`;
    window.open(`https://wa.me/905316753924?text=${encodeURIComponent(msg)}`);
    clearCart();
}

init();
