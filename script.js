const products = [
  {
    id: 1,
    name: "Laptop",
    type: "electronics",
    price: 1200,
    description: "A powerful laptop.",
    image:
      "	https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_640.jpg",
  },
  {
    id: 2,
    name: "T-shirt",
    type: "clothing",
    price: 100,
    description: "AC Milan FC t-shirt.",
    image:
      "https://sempremilan.com/wp-content/uploads/2024/02/Screenshot-2024-02-08-at-07.52.13.jpg",
  },
  {
    id: 3,
    name: "Smartphone",
    type: "electronics",
    price: 1000,
    description: "A latest smartphone.",
    image:
      "https://r2media.horizondm.com/catalog/product/cache/257553d71735e96dcdf7e87f4b22e6bc/i/p/iphone15-pro-max-1_3.jpeg",
  },
  {
    id: 4,
    name: "Shoes",
    type: "clothing",
    price: 1500,
    description: "Luxury shoes.",
    image:
      "https://cdn.salla.sa/bPBRj/VB4S7efv1pS5nf0AsAEH5bvM9xZsicoLd5qRiCNc.jpg",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || {};

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCartCount();
  renderCart();

  document.getElementById("search").addEventListener("input", filterProducts);
  document.getElementById("filter").addEventListener("change", filterProducts);
  document.getElementById("sort").addEventListener("change", sortProducts);
  document.getElementById("clear-cart").addEventListener("click", clearCart);
});

function renderProducts(productList) {
  const productContainer = document.getElementById("product-list");
  productContainer.innerHTML = "";

  productList.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="showDetails(${product.id})">Details</button>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <div class="product-details" id="details-${product.id}">
                <p>${product.description}</p>
                <button onclick="hideDetails(${
                  product.id
                })">Hide Details</button>
            </div>
        `;
    productContainer.appendChild(productItem);
  });
}

function showDetails(productId) {
  document.getElementById(`details-${productId}`).style.display = "block";
}

function hideDetails(productId) {
  document.getElementById(`details-${productId}`).style.display = "none";
}

function addToCart(productId) {
  if (cart[productId]) {
    cart[productId]++;
  } else {
    cart[productId] = 1;
  }
  updateCartCount();
  saveCart();
  renderCart();
}

function updateCartCount() {
  document.getElementById("cart-count").textContent = Object.values(
    cart
  ).reduce((sum, count) => sum + count, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function renderCart() {
  const existingCartContainer = document.getElementById("cart-container");
  if (existingCartContainer) {
    existingCartContainer.remove();
  }

  const cartContainer = document.createElement("div");
  cartContainer.id = "cart-container";
  cartContainer.innerHTML = "<h2>Your Cart</h2>";

  if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML += "<p>Your cart is empty.</p>";
  } else {
    const cartList = document.createElement("ul");
    Object.keys(cart).forEach((productId) => {
      const product = products.find((p) => p.id == productId);
      const cartItem = document.createElement("li");
      cartItem.innerHTML = `
                ${product.name} - $${product.price.toFixed(2)} x ${
        cart[productId]
      }
                <button onclick="increaseQuantity(${productId})">+</button>
                <button onclick="decreaseQuantity(${productId})">-</button>
                <button onclick="removeFromCart(${productId})">Remove</button>
            `;
      cartList.appendChild(cartItem);
    });
    cartContainer.appendChild(cartList);
  }

  document.body.appendChild(cartContainer);
}

function increaseQuantity(productId) {
  cart[productId]++;
  updateCartCount();
  saveCart();
  renderCart();
}

function decreaseQuantity(productId) {
  if (cart[productId] > 1) {
    cart[productId]--;
  } else {
    delete cart[productId];
  }
  updateCartCount();
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCartCount();
  saveCart();
  renderCart();
}

function filterProducts() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const filterType = document.getElementById("filter").value;
  const filteredProducts = products.filter((product) => {
    return (
      (filterType === "all" || product.type === filterType) &&
      product.name.toLowerCase().includes(searchQuery)
    );
  });
  renderProducts(filteredProducts);
}

function sortProducts() {
  const sortOption = document.getElementById("sort").value;
  let sortedProducts = [...products];

  if (sortOption === "asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(sortedProducts);
}

function clearCart() {
  cart = {};
  updateCartCount();
  saveCart();
  renderCart();
}
