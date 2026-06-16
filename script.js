let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cart = [];

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

                // NAV
                const navLink = document.createElement("a");
                navLink.href = `#${category.id}`;
                navLink.className = "nav-link";
                navLink.textContent = category.title;
                nav.appendChild(navLink);

                // SECTION
                const section = document.createElement("section");
                section.id = category.id;

                section.innerHTML = `
                    <h2 class="category-title">${category.title}</h2>
                `;

                category.items.forEach(item => {

                    const card = document.createElement("div");
                    card.className = "product-card";

                    card.innerHTML = `
                        <div>
                            <div class="product-name">${item.name}</div>
                            ${item.tag ? `<span class="tag">${item.tag}</span>` : ""}
                        </div>

                        <div>
                            <div class="price">${item.price} ₺</div>
                            <button onclick="addToCart('${item.sku}', '${item.name}', ${item.price})">
                                Ekle
                            </button>
                        </div>
                    `;

                    section.appendChild(card);
                });

                container.appendChild(section);
            });

    } catch (error) {
        console.error(error);
        container.innerHTML = "Hata: Menü yüklenemedi";
    }
}

// SEPETE EKLE
function addToCart(sku, name, price) {

    const existing = cart.find(x => x.sku === sku);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ sku, name, price, qty: 1 });
    }

    renderCart();
}

// SEPETİ ÇİZ
function renderCart() {

    const cartItems = document.getElementById("cart-items");
    const count = document.getElementById("cart-count");
    const total = document.getElementById("total-price");

    cartItems.innerHTML = "";

    let totalPrice = 0;
    let totalCount = 0;

    cart.forEach(item => {

        totalPrice += item.price * item.qty;
        totalCount += item.qty;

        const div = document.createElement("div");
        div.innerHTML = `
            ${item.name} x${item.qty}
        `;

        cartItems.appendChild(div);
    });

    count.textContent = totalCount + " Ürün";
    total.textContent = totalPrice + " ₺";
}

init();
localStorage.setItem("cart", JSON.stringify(cart));
