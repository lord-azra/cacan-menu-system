async function init() {

    const container = document.getElementById("menu-container");
    const nav = document.getElementById("category-nav");

    try {

        const response = await fetch("./data/menu.json");

        if (!response.ok) {
            throw new Error("JSON yüklenemedi");
        }

        const data = await response.json();

        container.innerHTML = "";
        nav.innerHTML = "";

        data.categories
            .sort((a, b) => a.order - b.order)
            .forEach(category => {

                const navLink = document.createElement("a");

                navLink.href = `#${category.id}`;
                navLink.className = "nav-link";
                navLink.textContent = category.title;

                nav.appendChild(navLink);

                const section = document.createElement("section");

                section.id = category.id;

                section.innerHTML = `
                    <h2 class="category-title">
                        ${category.title}
                    </h2>
                `;

                category.items.forEach(item => {

                    if (!item.available) return;

                    const card = document.createElement("div");

                    card.className = "product-card";

                    card.innerHTML = `
                        <div>
                            <div class="product-name">
                                ${item.name}
                            </div>

                            ${
                                item.tag
                                ? `<span class="tag">${item.tag}</span>`
                                : ""
                            }
                        </div>

                        <div class="price">
                            ${item.price}
                            ${data.restaurantInfo.currency}
                        </div>
                    `;

                    section.appendChild(card);

                });

                container.appendChild(section);

            });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p style="text-align:center;">
                Menü şu an yüklenemiyor.
            </p>
        `;
    }
}

init();
