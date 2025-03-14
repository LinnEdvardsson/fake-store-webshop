const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 2;


let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://fakestoreapi.com/products';
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('product-container');
            
            if (!productContainer) {
                console.log('Product container not found on this page');
                return;
            }
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-3', 'col-sm-6', 'col-12');

                productCard.innerHTML = `
                    <div class="card product-card border-0 shadow mt-10" style="background: linear-gradient(to bottom,rgb(247, 211, 183));">
                        <img src="${product.image}" class="h-50 product-img" alt="${product.title}">
                        <div class="card-body" style="color: #FFFF; font-style: italic; font-family: 'Times New Roman', Times, serif; ">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description.substring(0, 50)}...</p>
                            <p class="card-text"><strong>$${product.price}</strong></p>
                            <button class="btn btn-outline-light add-to-cart" style="background: linear-gradient(to bottom,rgb(247, 211, 183));" 
                                    data-id="${product.id}" 
                                    data-title="${product.title}" 
                                    data-price="${product.price}" 
                                    data-image="${product.image}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                
                // Add the card to the product container
                productContainer.appendChild(productCard);
            });

            // Add event listeners to all "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        })
        .catch(error => {
            console.error('Failed to fetch products:', error);
        });

    // Check if we're on the cart page and display cart items if we are
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        displayCartItems();
    }

    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                alert("Search function is out of order");
            }
        });
    }
});

// Function to add items to cart
function addToCart(event) {
    const button = event.target;
    const id = button.dataset.id;
    const title = button.dataset.title;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;
    
    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
        // Increment quantity if item exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item if it doesn't exist
        cart.push({
            id,
            title,
            price,
            image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in the UI
    updateCartCount();
    
    // Visual feedback
    button.textContent = 'Added!';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
    }, 1000);
}

// Function to update the cart count badge
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Function to display cart items on the cart page
function displayCartItems() {
    const cartContainer = document.getElementById('cart-container');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="alert alert-info">Your cart is empty</div>';
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
                            <button class="btn btn-outline remove-from-cart" data-id="${item.id}">Remove</button>
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
                        <button id="checkout-button" class="btn btn-success">Proceed to Checkout</button>
                        <button id="clear-cart" class="btn btn-outline-secondary ms-2">Clear Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartHTML;
    
    // Add event listeners for cart actions
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

// Function to increase item quantity
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

// Function to decrease item quantity
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

// Function to remove item from cart
function removeFromCart(event) {
    const id = event.target.dataset.id;
    cart = cart.filter(item => item.id !== id);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Function to clear the entire cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Function to proceed to checkout
function checkout() {
    // Redirect to checkout page or show checkout modal
    window.location.href = 'placeOrder.html';
}

// controll input at form in placeorder.