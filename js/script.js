"use strict";
/* get elements  */
const productImage = document.getElementById("product-image");
const breadcrumbTitle = document.getElementById("breadcrumb-title");
const breadCrumbCategory = document.getElementById("breadcrumb-category");
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

/* Quantity controls */
const quantity = document.getElementById("quantity");
const decreaseQuantity = document.getElementById("decrease-quantity");
const increaseQuantity = document.getElementById("increase-quantity");
const addToCart = document.getElementById("add-to-cart");

/* search and filter */
let filteredProducts = products;
const searchProduct = document.getElementById("search-product");
const sortProduct = document.getElementById("sortProduct");
const filterByCategories = document.getElementById("filterByCategories");


/* Pagination controls */
const prevBtn = document.getElementById("prev-Btn");
const nextBtn = document.getElementById("next-Btn");
const pageIndicator = document.getElementById("pageIndicator");

/* Pagination state */
const productsPerPage = 8;
let currentPage = 1;

/* product display grid */
const productGrid = document.getElementById("product-grid");

/* Part A: Render product card to   shop project grid*/
function renderShopProductCard(product) {
	if (productGrid) {

		/* create div card */
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
		productGrid.appendChild(productCol);
	}
}

/* Part B: read url string */
//read query parameters
//open shop item in product page
const urlParams = new URLSearchParams(window.location.search);

//extract the id
const productIdParam = urlParams.get("id");

if (productIdParam) {
	const targetId = parseInt(productIdParam);
	const matchedProduct = products.find(function (product) {
		return product.id === targetId;
	});

	if (matchedProduct) {
		renderProducts(matchedProduct);
	} else {
		console.error("Id doesnt match");
	}
}

/* Part C: helpers functions */
function formatPrice(price) {
	return "₦" + price.toLocaleString("en-NG");
}

function getTotalPages() {
	const totalPages = filteredProducts.length / productsPerPage;
	return Math.ceil(totalPages);
}

/* show product in product-details page */
function renderProducts(product) {
	breadcrumbTitle.textContent = product.name;
	breadCrumbCategory.textContent = product.category;
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

/* PArt D:  render current pages in shop*/
function renderCurrentPage() {
	const startIndex = (currentPage - 1) * productsPerPage;
	const endIndex = startIndex + productsPerPage;

	/* reveal only 8 selected products */
	const revealProducts = filteredProducts.slice(startIndex, endIndex);

	/* clear product grid */
	productGrid.innerHTML = "";

	/* show the 8 products */
	revealProducts.forEach(product => {
		renderShopProductCard(product);
	});

	/* udate pagination control */
	updatePaginationControls();
}

/* Part E: Update pagination controls */
function updatePaginationControls() {
	pageIndicator.textContent = currentPage;

	/* disable prev button first page */
	if (currentPage === 1) {
		prevBtn.disabled = true;
	} else { prevBtn.disabled = false; };

	/* disabled next button on last page */

	if (currentPage === getTotalPages()) {
		nextBtn.disabled = true;
	} else {
		nextBtn.disabled = false;
	};
};

/* Part F: show next and previous page */
if (nextBtn) {
	nextBtn.addEventListener("click", () => {
		if (currentPage < getTotalPages()) {
			currentPage++;
			renderCurrentPage();
		}
	})
}

if (prevBtn) {
	prevBtn.addEventListener("click", () => {
		if (currentPage > 1) {
			currentPage--;
			renderCurrentPage();
		}
	})
}
/* show current page */
if (productGrid) {
	renderCurrentPage();
}

/* Part G: Filter */

// get shop product from array 
searchProduct.addEventListener("input", () => {
	/* get input value */
	//convert to lowercase

	let inputValue = searchProduct.value;
	let searchTerm = inputValue.toLowerCase();

	/* get filtered productd and show it */
	filteredProducts = products.filter(function (product) {
		const productName = product.name.toLowerCase();

		/* return any product that matches input values */
		return productName.includes(searchTerm);
	});
	
	/*display collection from first page.*/
	currentPage = 1;

	/* display product */
	renderCurrentPage();
 })