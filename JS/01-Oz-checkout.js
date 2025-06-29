const products = [
  {
    image: 'Images/newyorkCookies.jpg',
    name: 'New York Style Cookies',
    priceCents: 1500
  },
  {
    image: 'Images/brownies.jpg',
    name: 'Classic Brownies',
    priceCents: 1200
  },
  {
    image: 'Images/DoubleChoclateCookies.jpg',
    name: 'Double Chocolate Cookies',
    priceCents: 1400
  },
  {
    image: 'Images/CaramelBites.jpg',
    name: 'Caramel Bites',
    priceCents: 1800
  }
];

let productsHTML = '';
products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}" alt="${product.name}">
      </div>
      
      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select aria-label="Select quantity">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="Images/icons/checkmark.png" alt="Checkmark">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" type="button">
        Add to Cart
      </button>
    </div>`;
});

console.log(productsHTML);
document.querySelector('.js-products-grid').innerHTML = productsHTML;
