// Navigasyonu sadece ilk yüklemede oluştur
function renderNav(categories) {
    const nav = document.getElementById("category-nav");
    categories.forEach(cat => {
        const link = document.createElement("a");
        link.href = "#" + cat.id;
        link.textContent = cat.title;
        nav.appendChild(link);
    });
}

// renderMenu artık sadece ürünleri güncellemeli
function renderMenu(categories) {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";
    categories.forEach(cat => {
        const section = document.createElement("section");
        section.id = cat.id;
        section.innerHTML = `<h2>${cat.title}</h2>`;
        cat.items.forEach(item => {
            const div = document.createElement("div");
            div.className = "product-card";
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>${item.price} ₺
                </div>
                <button onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">➕ Ekle</button>
            `;
            section.appendChild(div);
        });
        container.appendChild(section);
    });
}
