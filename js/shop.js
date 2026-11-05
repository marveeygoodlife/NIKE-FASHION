"use strict";

// Get shop elements
const productGrid = document.getElementById("product-grid");
const pageIndicator = document.getElementById("page-indicator");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const searchProduct = document.getElementById("search-product");
const sortProduct = document.getElementById("sortProduct");
const filterByCategories = document.getElementById("filterByCategories");

// Pagination settings
const productsPerPage = 8;
let currentPage = 1;

// Search and filter settings
let filteredProducts = [...products];
let searchTerm = "";
let selectedCategory = "all";

// Calculate total pages
function getTotalPages() {
	return Math.ceil(filteredProducts.length / productsPerPage);
}

// Render a single product card
function renderShopProductCard(product) {
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

// Update pagination controls
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

// Render current page
function renderCurrentPage() {
	if (!productGrid) return;

	const startIndex = (currentPage - 1) * productsPerPage;
	const endIndex = startIndex + productsPerPage;

	const revealedProducts = filteredProducts.slice(startIndex, endIndex);

	productGrid.innerHTML = "";

	if (revealedProducts.length === 0) {
		productGrid.innerHTML = `
			<div class="col-12 text-center py-5">
				<h4>No products found</h4>
				<p>Try another search or category.</p>
			</div>
		`;
	} else {
		revealedProducts.forEach(function (product) {
			renderShopProductCard(product);
		});
	}

	updatePaginationControls();
}

// Sort products
function applySorting() {
	if (!sortProduct) return;

	const sortValue = sortProduct.value;

	if (sortValue === "price-low-high") {
		filteredProducts.sort(function (a, b) {
			return a.price - b.price;
		});
	} else if (sortValue === "price-high-low") {
		filteredProducts.sort(function (a, b) {
			return b.price - a.price;
		});
	} else if (sortValue === "name-a-z") {
		filteredProducts.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});
	} else if (sortValue === "name-z-a") {
		filteredProducts.sort(function (a, b) {
			return b.name.localeCompare(a.name);
		});
	} else {
		const originalOrder = new Map(
			products.map(function (product, index) {
				return [product.id, index];
			}),
		);

		filteredProducts.sort(function (a, b) {
			return originalOrder.get(a.id) - originalOrder.get(b.id);
		});
	}
}

// Apply search and category filters
function applyFilters() {
	const searchInput = searchProduct ? searchProduct.value : "";
	searchTerm = searchInput.toLowerCase().trim();

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

// Search listener
if (searchProduct) {
	searchProduct.addEventListener("input", applyFilters);
}

// Category filter listener
if (filterByCategories) {
	filterByCategories.addEventListener("change", function () {
		selectedCategory = filterByCategories.value;
		applyFilters();
	});
}

// Sorting listener
if (sortProduct) {
	sortProduct.addEventListener("change", applyFilters);
}

// Previous page listener
if (prevBtn) {
	prevBtn.addEventListener("click", function () {
		if (currentPage > 1) {
			currentPage--;
			renderCurrentPage();
		}
	});
}

// Next page listener
if (nextBtn) {
	nextBtn.addEventListener("click", function () {
		if (currentPage < getTotalPages()) {
			currentPage++;
			renderCurrentPage();
		}
	});
}

// Initial shop rendering
if (productGrid) {
	renderCurrentPage();
}
