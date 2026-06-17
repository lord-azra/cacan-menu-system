let orders = JSON.parse(localStorage.getItem("orders")) || [];

let total = 0;

orders.forEach(o => {
    total += o.total;
});

document.getElementById("stats").innerHTML = `
    <h3>Toplam Sipariş: ${orders.length}</h3>
    <h3>Günlük Ciro: ${total} ₺</h3>
`;
