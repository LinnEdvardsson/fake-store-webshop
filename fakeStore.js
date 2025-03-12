
const searchInput = document.getElementById('searchInput');


document.addEventListener('DOMContentLoaded', function() {
    // URL till Fake Store API
    const apiUrl = 'https://fakestoreapi.com/products';

    // Hämta alla produkter från API
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('product-container');

            // Loopa igenom alla produkter och skapa HTML för varje produkt
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-3', 'col-sm-6', 'col-12');

                productCard.innerHTML = `
                    <div class="card product-card" style="background-color:#d3bcb0 ">
                        <img src="${product.image}" class="h-100 product-img" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <p class="card-text"><strong>$${product.price}</strong></p>
                            <a href="cart.html" class="btn btn-secondary" style="background-color: #d3bcb0">Buy now!</a>
                        </div>
                    </div>
                `;

                // Lägg till kortet i produktcontainern
                productContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Det gick inte att hämta produkter:', error);
        });
});

// Badges.


searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      alert("Search function is out of order");
    }
  });
