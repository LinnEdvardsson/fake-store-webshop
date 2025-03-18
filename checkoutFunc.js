

function checkout() {
    window.location.href = 'placeOrder.html';
    orderSum();
}

document.addEventListener('DOMContentLoaded', function() {
    orderSum();
});

function orderSum() {
    const summeryContainer = document.getElementById('summeryContainer');
    if (!summeryContainer) {
        console.error('summeryContainer element not found!');
        return;
    }
    displayItems(summeryContainer);
}

document.addEventListener('DOMContentLoaded', function() {
    displayItems();
});

function displayItems(container) {
    if (!container) {
        container = document.getElementById('summeryContainer'); 
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        container.innerHTML = '<div class="alert alert-info-lg">Your cart is empty</div>';
        return;
    }

    let totalPrice = 0;
    let cartHTML = '<div class="card p-3">'; 

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        cartHTML += `
            <div class="row mb-3">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid" style="max-height: 100px; object-fit: contain;">
                </div>
                <div class="col-md-6">
                    <h5>${item.title}</h5>
                    <p>Price: $${item.price} | Quantity: ${item.quantity}</p>
                </div>
            </div>
        `;
    });

    cartHTML += `
        <div class="row mt-3">
            <div class="col-12">
                <h5>Total Price: $${totalPrice}</h5>
            </div>
        </div>
    `;

    cartHTML += '</div>';

    container.innerHTML = cartHTML;
}
