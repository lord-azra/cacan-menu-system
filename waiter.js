let orders = JSON.parse(localStorage.getItem("orders")) || [];

function renderOrders() {

    const box = document.getElementById("orders");
    box.innerHTML = "";

    if (orders.length === 0) {
        box.innerHTML = "<p>Sipariş yok</p>";
        return;
    }

    orders.forEach((o, i) => {

        const div = document.createElement("div");

        let itemsText = "";

        o.items.forEach(item => {
            itemsText += `${item.name} x${item.qty}<br>`;
        });

        div.innerHTML = `
            <h3>Masa: ${o.table}</h3>
            ${itemsText}
            <b>Toplam: ${o.total} ₺</b>
            <hr>
            <button onclick="completeOrder(${i})">✔ Tamamlandı</button>
        `;

        box.appendChild(div);
    });
}

function completeOrder(index) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
}

renderOrders();
