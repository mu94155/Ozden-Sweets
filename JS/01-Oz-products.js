let productsHTML = '';
products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
        <div class="product-image-container">
            <img class="product-image" src="${product.image}">
          </div>
          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>
          <div class="product-price 8 species pack">
           علبة 8 قطع :${product.price} ر.ع</div>
           <div class="product-price 12 species pack">
           علبة 12 قطع :${(product.price)+(product.price*0.25)} ر.ع</div>
          <div class="description">${product.description}</div>
          <div class="product-category">${product.category}</div>
          <div class="product-id">${product.id}</div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png" alt="Checkmark">
            Added
          </div>

          <button class="add-to-cart-button button-primary">
            Add to Cart
          </button>
        </div> `;
});
document.querySelector('.js-products-grid').innerHTML = productsHTML;
document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', () => {
  const productName= button.dataSet.productName;
  cart.push({ product: productName ,
    quantity: 1
  });
}));
