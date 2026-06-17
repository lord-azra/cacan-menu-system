let cart = JSON.parse(localStorage.getItem("cart")) || [];
let menuData = null;

async function init() {

```
try {

    const res = await fetch("./data/menu.json");
    menuData = await res.json();

    renderMenu(menuData.categories);
    renderCart();

    document.getElementById("searchInput")
        .addEventListener("input", searchProducts);

} catch (err) {
    console.error(err);

    document.getElementById("menu-container").innerHTML =
        "<p>Menü yüklenemedi.</p>";
}
```

}

function renderMenu(categories) {

```
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

    section.innerHTML =
        `<h2>${cat.title}</h2>`;

    cat.items.forEach(item => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div>
                <div class="product-name">
                    ${item.name}
                </div>

                ${item.tag ?
                    `<span class="tag">${item.tag}</span>`
                    : ""
                }
            </div>

            <div class="price">
                ${item.price} ₺
            </div>
        `;

        card.onclick = () => addToCart(item);

        section.appendChild(card);
    });

    container.appendChild(section);
});
```

}

function searchProducts() {

```
const text =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

const filtered = {
    categories: menuData.categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.name.toLowerCase().includes(text)
        )
    }))
};

renderMenu(filtered.categories);
```

}

function addToCart(item) {

```
const found =
    cart.find(x => x.sku === item.sku);

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
```

}

function changeQty(sku, value) {

```
const item =
    cart.find(x => x.sku === sku);

if (!item) return;

item.qty += value;

if (item.qty <= 0) {
    cart = cart.filter(x => x.sku !== sku);
}

renderCart();
```

}

function removeItem(sku) {

```
cart =
    cart.filter(x => x.sku !== sku);

renderCart();
```

}

function clearCart() {

```
cart = [];

renderCart();
```

}

function renderCart() {

```
const box =
    document.getElementById("cart-items");

let count = 0;
let total = 0;

box.innerHTML = "";

cart.forEach(item => {

    count += item.qty;
    total += item.qty * item.price;

    const div =
        document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
        <span>
            ${item.name}
        </span>

        <div class="cart-controls">

            <button onclick="changeQty('${item.sku}', -1)">
                -
            </button>

            <span>
                ${item.qty}
            </span>

            <button onclick="changeQty('${item.sku}', 1)">
                +
            </button>

            <button onclick="removeItem('${item.sku}')">
                🗑
            </button>

        </div>
    `;

    box.appendChild(div);
});

document.getElementById("cart-count")
    .innerText = count + " Ürün";

document.getElementById("total-price")
    .innerText = total + " ₺";

const mobile =
    document.getElementById("mobile-total");

if (mobile) {
    mobile.innerText = total + " ₺";
}

localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);
```

}

function sendWhatsApp() {

```
const table =
    document.getElementById("tableNo").value;

if (!table) {

    alert("Masa numarası giriniz.");

    return;
}

if (cart.length === 0) {

    alert("Sepet boş.");

    return;
}

let total = 0;

let message =
    `🍽️ SİPARİŞ\n\nMasa: ${table}\n\n`;

cart.forEach(item => {

    total += item.price * item.qty;

    message +=
        `${item.name} x${item.qty}\n`;
});

message +=
    `\nToplam: ${total} ₺`;

localStorage.setItem(
    "orders",
    JSON.stringify([
        ...(JSON.parse(
            localStorage.getItem("orders")
        ) || []),
        {
            table,
            items: [...cart],
            total,
            date: Date.now()
        }
    ])
);

alert("Sipariş kaydedildi.");

clearCart();
```

}

init();
