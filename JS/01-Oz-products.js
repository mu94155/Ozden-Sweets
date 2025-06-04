let productsHTML = '';
const products = [{
  image:"Images/browniesWithNuts.jpg",
  name: "براونيز بالمكسرات",
  price: 15.00,
  description: "براونيز لذيذ مع قطع المكسرات المقرمشة.",
  category: "حلويات",
  id: "browniesWithNuts"
}, {
  image:"Images/brownies.jpg",
  name: "كب كيك بالفانيليا",
  price: 12.00,
  description: "كب كيك لذيذ بنكهة الفانيليا مع كريمة خفيفة.",
  category: "حلويات",
  id: "cupcakes"
}, {
  image:"Images/browniesDifferentSouce.jpg",
  name: "كيكة الشوكولاتة",
  price: 20.00,
  description: "كيكة غنية بالشوكولاتة مع طبقة من الكريمة.",
  category: "حلويات",
  id: "chocolateCake"
}, {
  image:"Images/browniesDifferentSouce3.jpg",
  name: "تشيز كيك بالفراولة",
  price: 18.00,
  description: "تشيز كيك لذيذ مع طبقة من الفراولة الطازجة.",
  category: "حلويات",
  id: "cheesecake"
}, {
  image:"Images/CaramelBites.jpg",
  name: "تارت الفواكه",
  price: 16.00,
  description: "تارت مكون من قاعدة بسكويت مع طبقة من الكريمة والفواكه الطازجة.",
  category: "حلويات",
  id: "fruitTart"
}, {
  image:"Images/DoubleChoclateCookies.jpg",
  name: "ماكرون بالفواكه",
  price: 14.00,
  description: "ماكرون لذيذ بنكهات مختلفة من الفواكه.",
  category: "حلويات",
  id: "macarons"
}, {
  image:"Images/newyorkCookies.jpg",
  name: "معجنات متنوعة",
  price: 10.00,
  description: "مجموعة من المعجنات الطازجة واللذيذة.",
  category: "حلويات",
  id: "pastries"
}, {
  image:"Images/newyorkCookies1.jpg",
  name: "آيس كريم بالفواكه",
  price: 8.00,
  description: "آيس كريم لذيذ مع قطع من الفواكه الطازجة.",
  category: "حلويات",
  id: "iceCream"
}, {
  image:"Images/newyorkCookies2.jpg",
  name: "كوكيز الشوكولاتة",
  price: 9.00,
  description: "كوكيز لذيذ مع قطع من الشوكولاتة.",
  category: "حلويات",
  id: "chocolateCookies"
}, {
  image:"Images/newyorkCookies3.jpg",
  name: "براونيز بالشوكولاتة البيضاء",
  price: 17.00,
  description: "براونيز لذيذ مع قطع من الشوكولاتة البيضاء.",
  category: "حلويات",
  id: "whiteChocolateBrownies"
}, {
  image:"Images/newyorkCookies4.jpg",
  name: "كوكيز الشوفان",
  price: 11.00,
  description: "كوكيز صحي ولذيذ مصنوع من الشوفان.",
  category: "حلويات",
  id: "oatmealCookies"
}, {
  image:"Images/newyorkCookiesPistachio.jpg",
  name: "كوكيز باللوز",
  price: 13.00,
  description: "كوكيز لذيذ مع قطع من اللوز المقرمش.",
  category: "حلويات",
  id: "almondCookies"
}, {
  image:"Images/newyorkRedVelvet.jpg",
  name: "كوكيز بالفواكه المجففة",
  price: 15.00,
  description: "كوكيز لذيذ مع قطع من الفواكه المجففة.",
  category: "حلويات",
  id: "driedFruitCookies"
}];

products.forEach((product) => {
  productsHTML += `
    <div class="product">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <span class="price">${product.price.toFixed(2)} ر.س</span>
      <button class="add-to-cart" data-id="${product.id}">أضف إلى السلة</button>
    </div>
  `;
  
});

document.querySelector('.js-prodcuts-grid').innerHTML = productsHTML;