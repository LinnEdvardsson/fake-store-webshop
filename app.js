

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

document.addEventListener('DOMContentLoaded', function(){
    loadShop();

});

function loadShop() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://fakestoreapi.com/products', true);

    xhr.onload = function() {
        if(this.status == 200) {
            var shopLoad = JSON.parse(this.responseText);

            var output = '';
            for(var i in shopLoad) {
                var product = shopLoad[i];
               // Creating the product card
               output += `
               <div class="col-md-3 col-sm-6 col-12 g-4">
                <div class="card product-card border-0 shadow mt-10" style="background: linear-gradient(to bottom,rgb(247, 211, 183));" height: 100%; display: flex; flex-direction: column;">
                     <div style="height: 50%; overflow: hidden;">
                           <img src="${product.image}" class="w-100 h-50 rounded product-img" alt="${product.title}" style="object-fit: cover;">
                           <div class="card-body d-flex flex-column" style="color: #FFFF; font-style: italic; font-family: 'Times New Roman', Times, serif;">
                               <h5 class="card-title" style="height: 50px; overflow: hidden;">${product.title}</h5>
                               <p class="card-text" style="height: overflow: hidden;; ">${product.description.substring(0, 100)}...</p>
                               <p class="card-text"><strong>Price: $${product.price}</strong></p>
                               <button class="btn btn-outline-light add-to-cart" style="background: linear-gradient(to bottom,rgb(247, 211, 183));"
                                       data-id="${product.id}" 
                                       data-title="${product.title}"
                                       data-price="${product.price}" 
                                       data-image="${product.image}">
                                   Add to Cart
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
               `;
            }

            // Insert the product cards into the container
            document.getElementById("product-container").innerHTML = output;

            // Add event listeners to the "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        }
    };

    xhr.onerror = function() {
        console.error('Request failed');
    };

    xhr.send();
}

 // Function to add items to cart
function addToCart(event) {
    console.log('Add to Cart button clicked');
    const button = event.target;
    const id = button.dataset.id;
    const title = button.dataset.title;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id,
            title,
            price,
            image,
            quantity: 1
        });
    }
    

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    button.textContent = 'Added!';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
    }, 1000);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});


function displayCartItems() {
    const cartContainer = document.getElementById('cart-container');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="alert alert-info-lg">Your cart is empty</div>';
        return;
    }
    
    
    let totalPrice = 0;
    let cartHTML = '<div class="row">';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        cartHTML += `
            <div class="col-12 mb-10">
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-2">
                            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}" style="max-height: 100px; object-fit: contain;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text">
                                    Price: $${item.price.toFixed(2)} | Quantity: 
                                    <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${item.id}">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${item.id}">+</button>
                                </p>
                                <p class="card-text">Total: $${itemTotal.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="col-md-2 d-flex align-items-center justify-content-center">
                            <button class="btn btn-outline remove-from-cart" data-id="${item.id}"class="btn btn-outline ms-2" style="background-color: #eecdbc; color: white;">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    
    cartHTML += `
        <div class="row mt-3">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Cart Summary</h5>
                        <p class="card-text">Total Items: ${cart.reduce((total, item) => total + item.quantity, 0)}</p>
                        <p class="card-text">Total Price: $${totalPrice.toFixed(2)}</p>
                        <button id="checkout-button" class="btn btn-outline ms-2" style="background-color: #eecdbc; color: white;">Proceed to Checkout</button>
                        <button id="clear-cart" class="btn btn-outline ms-2" style="background-color: #eecdbc; color: white;">Clear Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartHTML;
    
    // Cart functions && cart-listeners
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
    
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('checkout-button').addEventListener('click', checkout);
}


function increaseQuantity(event) {
    const id = event.target.dataset.id;
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

function decreaseQuantity(event) {
    const id = event.target.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

function removeFromCart(event) {
    const id = event.target.dataset.id;
    cart = cart.filter(item => item.id !== id);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}


function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}