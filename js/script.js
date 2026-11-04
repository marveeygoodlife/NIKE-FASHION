"use strict";

/* 
   PART 1: CHECK PRODUCT DATA
 */

if (typeof products !== "undefined") {
	/* 
       PART 2: GET HTML ELEMENTS
     */

	/* Product details */
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

	/* Shop search and filters */
	const searchProduct = document.getElementById("search-product");
	const sortProduct = document.getElementById("sortProduct");
	const filterByCategories = document.getElementById("filterByCategories");

	/* Pagination */
	const prevBtn = document.getElementById("prev-Btn");
	const nextBtn = document.getElementById("next-Btn");
	const pageIndicator = document.getElementById("pageIndicator");

	/* Product grid */
	const productGrid = document.getElementById("product-grid");

	/* =====================================
       PART 3: PRODUCT STATE
    ===================================== */

	let filteredProducts = [...products];
	let searchTerm = "";
	let selectedCategory = "all";

	const productsPerPage = 8;
	let currentPage = 1;

	/* =====================================
       PART 4: HELPER FUNCTIONS
    ===================================== */

	/* Format product price */
	function formatPrice(price) {
		return "₦" + price.toLocaleString("en-NG");
	}

	/* Calculate total pages */
	function getTotalPages() {
		return Math.ceil(filteredProducts.length / productsPerPage);
	}

	/* =====================================
       PART 5: PRODUCT DETAILS PAGE
    ===================================== */

	/* Check whether product details elements exist */
	const isProductDetailsPage =
		productImage &&
		breadcrumbTitle &&
		breadCrumbCategory &&
		productCategory &&
		productName &&
		productRating &&
		productPrice &&
		productDescription &&
		productFullDescription &&
		productSize &&
		productColor &&
		productBrand &&
		productCategoryDetail &&
		productColorDetail &&
		productSizesDetail;

	/* Render selected product */
	function renderProducts(product) {
		if (!isProductDetailsPage) return;

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

		/* Populate product sizes */
		productSize.innerHTML =
			'<option value="" selected disabled>Select size</option>';

		product.size.forEach(function (size) {
			const option = document.createElement("option");
			option.value = size;
			option.textContent = size;
			productSize.appendChild(option);
		});

		/* Populate product colors */
		productColor.innerHTML =
			'<option value="" selected disabled>Select color</option>';

		product.color.forEach(function (color) {
			const option = document.createElement("option");
			option.value = color;
			option.textContent = color;
			productColor.appendChild(option);
		});
	}

	/* Get product ID from URL */
	const urlParams = new URLSearchParams(window.location.search);
	const productIdParam = urlParams.get("id");

	if (productIdParam && isProductDetailsPage) {
		const targetId = Number(productIdParam);

		const matchedProduct = products.find(function (product) {
			return product.id === targetId;
		});

		if (matchedProduct) {
			renderProducts(matchedProduct);
		} else {
			console.error("Product ID does not match.");
		}
	}

	/*
       PART 6: SHOP PRODUCT CARDS
     */

	/* Render individual product card */
	function renderShopProductCard(product) {
		if (!productGrid) return;

		const productCol = document.createElement("div");
		productCol.classList.add("col-12", "col-sm-6", "col-lg-3");

		productCol.innerHTML = `
            <article class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.alt}" class="img-fluid" loading="lazy">
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

	/* 
       PART 7: PAGINATION
     */

	/* Update pagination controls */
	function updatePaginationControls() {
		if (pageIndicator) {
			pageIndicator.textContent = currentPage;
		}

		if (prevBtn) {
			prevBtn.disabled = currentPage === 1;
		}

		if (nextBtn) {
			nextBtn.disabled = currentPage >= getTotalPages();
		}
	}

	/* Render current shop page */
	function renderCurrentPage() {
		if (!productGrid) return;

		const startIndex = (currentPage - 1) * productsPerPage;
		const endIndex = startIndex + productsPerPage;

		const revealProducts = filteredProducts.slice(startIndex, endIndex);

		/* Clear product grid */
		productGrid.innerHTML = "";

		/* Display selected products */
		revealProducts.forEach(function (product) {
			renderShopProductCard(product);
		});

		updatePaginationControls();
	}

	/* Next page */
	if (nextBtn) {
		nextBtn.addEventListener("click", function () {
			if (currentPage < getTotalPages()) {
				currentPage++;
				renderCurrentPage();
			}
		});
	}

	/* Previous page */
	if (prevBtn) {
		prevBtn.addEventListener("click", function () {
			if (currentPage > 1) {
				currentPage--;
				renderCurrentPage();
			}
		});
	}

	/* Initial shop products */
	if (productGrid) {
		renderCurrentPage();
	}

	/* =====================================
       PART 8: SEARCH AND FILTER
    ===================================== */

	/* Apply search and category filters */
	function applyFilters() {
		const searchInput = searchProduct ? searchProduct.value : "";
		searchTerm = searchInput.toLowerCase();

		filteredProducts = products.filter(function (product) {
			const name = product.name.toLowerCase();

			return (
				name.includes(searchTerm) &&
				(selectedCategory === "all" || product.category === selectedCategory)
			);
		});

		applySorting();

		currentPage = 1;
		renderCurrentPage();
	}

	/* Search products */
	if (searchProduct) {
		searchProduct.addEventListener("input", function () {
			applyFilters();
		});
	}

	/* Filter by category */
	if (filterByCategories) {
		filterByCategories.addEventListener("change", function () {
			selectedCategory = filterByCategories.value;
			applyFilters();
		});
	}

	/* =====================================
       PART 9: SORT PRODUCTS
    ===================================== */

	function applySorting() {
		if (!sortProduct) return;

		const sortValue = sortProduct.value;

		if (sortValue === "price-low-high") {
			filteredProducts.sort((a, b) => a.price - b.price);
		} else if (sortValue === "price-high-low") {
			filteredProducts.sort((a, b) => b.price - a.price);
		} else if (sortValue === "name-a-z") {
			filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortValue === "name-z-a") {
			filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
		} else {
			const originalOrder = new Map(
				products.map((product, index) => [product.id, index]),
			);

			filteredProducts.sort(
				(a, b) => originalOrder.get(a.id) - originalOrder.get(b.id),
			);
		}
	}

	/* Sort products on selection */
	if (sortProduct) {
		sortProduct.addEventListener("change", function () {
			applyFilters();
		});
	}

	/* =====================================
       PART 10: QUANTITY CONTROLS
    ===================================== */

	/* Increase quantity */
	if (increaseQuantity && quantity) {
		increaseQuantity.addEventListener("click", function () {
			let quantityValue = Number(quantity.value);
			quantity.value = quantityValue + 1;
		});
	}

	/* Decrease quantity */
	if (decreaseQuantity && quantity) {
		decreaseQuantity.addEventListener("click", function () {
			let quantityValue = Number(quantity.value);

			if (quantityValue > 1) {
				quantity.value = quantityValue - 1;
			}
		});
	}
}
