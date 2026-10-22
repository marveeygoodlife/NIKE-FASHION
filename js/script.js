"use strict";
/* get elements  */
const productImage = document.getElementById("product-image");

const productCategory = document.getElementById("product-category");

const productName = document.getElementById("product-name");

const productRating = document.getElementById("product-rating");

const productPrice = document.getElementById("product-price");

const productDescription = document.getElementById("product-description");

const productFullDescription = document.getElementById(
	"product-full-description",
);

const productSize = document.getElementById("product-size");

const productColor = document.getElementById("product-color");

const productBrand = document.getElementById("product-brand");

const productCategoryDetail = document.getElementById(
	"product-category-detail",
);

const productColorDetail = document.getElementById("product-color-detail");

const productSizesDetail = document.getElementById("product-sizes-detail");

const quantity = document.getElementById("quantity");

const decreaseQuantity = document.getElementById("decrease-quantity");

const increaseQuantity = document.getElementById("increase-quantity");

const addToCart = document.getElementById("add-to-cart");

/* Part A: Render product to HTML */
const productGrid = document.getElementById("product-grid");
if (productGrid) {
	products.forEach((product) => {
		const productCol = document.createElement("div");
		productCol.classList.add("col-12", "col-sm-6", "col-lg-3");

		productCol.innerHTML = `

	       <article class="product-card">
                    <div class="product-image">
                   <img src=" ${product.image}" alt="${product.alt}" class="img-fluid" loading="lazy">
                        <span class="product-badge">${product.badge}</span>
                    </div>
                    <div class="product-content">
                        <span class="product-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p class="product-price">${formatPrice(product.price)}</p>
                        <a href="product-details.html?id=${product.id}" class="product-link">View Product</a>
                    </div>
                </article>
	`;

		console.log("productGrid element:", productGrid);
		productGrid.appendChild(productCol);
	});
}


/* Part B: read url string */

//read query parameters
const urlParams = new URLSearchParams(window.location.search);

//extract the id
const productIdParam = urlParams.get("id");

if (productIdParam) {
	const targetId = parseInt(productIdParam);
	const matchedProduct = products.find(function (product) {
		return product.id === targetId; 
	});
	if (matchedProduct) {
		renderUI(matchedProduct)
	} else {
		console.error("Id doesnt match")
	}
}

/* Part C: helpers functions */
function formatPrice(price) {
	return "₦" + price.toLocaleString("en-NG");
}

function renderUI(product) {
	productImage.src = product.image;
	productImage.setAttribute("alt", product.alt);
	productName.textContent = product.name;
	productCategory.textContent = product.category;
	productDescription.textContent = product.description;
	productFullDescription.textContent = product.description;
	productRating.textContent = product.rating;
	productPrice.textContent = formatPrice(product.price);
	productBrand.textContent = product.brand;
	productColorDetail.textContent = product.color.join(", ");
	productSizesDetail.textContent = product.size.join(", ");
	productCategoryDetail.textContent = product.category;

	/* loop through product size & color */

	productSize.innerHTML =
		'<option value="" selected disabled>Select size</option>';

	product.size.forEach(function (size) {
		const option = document.createElement("option");
		option.value = size;
		option.textContent = size;
		productSize.appendChild(option);
	});
	productColor.innerHTML =
		'<option value="" selected disabled>Select color</option>';

	product.color.forEach(function (color) {
		const option = document.createElement("option");
		option.value = color;
		option.textContent = color;
		productColor.appendChild(option);
	});

 }