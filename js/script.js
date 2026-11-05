"use strict";

if (typeof products !== "undefined") {
	// Get HTML elements

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

	const quantity = document.getElementById("quantity");
	const decreaseQuantity = document.getElementById("decrease-quantity");
	const increaseQuantity = document.getElementById("increase-quantity");
	const addToCart = document.getElementById("add-to-cart");

	const searchProduct = document.getElementById("search-product");
	const sortProduct = document.getElementById("sortProduct");
	const filterByCategories = document.getElementById("filterByCategories");

	const prevBtn = document.getElementById("prev-Btn");
	const nextBtn = document.getElementById("next-Btn");
	const pageIndicator = document.getElementById("pageIndicator");

	const productGrid = document.getElementById("product-grid");

	const cartItemsContainer = document.getElementById("cart-items");
	const cartEmpty = document.getElementById("cart-empty");
	const cartContent = document.getElementById("cart-content");
	const cartSubtotal = document.getElementById("cart-subtotal");
	const cartTotal = document.getElementById("cart-total");

	// Product state

	let filteredProducts = [...products];
	let searchTerm = "";
	let selectedCategory = "all";
	const productsPerPage = 8;
	let currentPage = 1;

	// Helper functions

	function formatPrice(price) {
		return "₦" + price.toLocaleString("en-NG");
	}

	function getTotalPages() {
		return Math.ceil(filteredProducts.length / productsPerPage);
	}

	// Product details page

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

	function renderProducts(product) {
		if (!isProductDetailsPage) return;

		breadcrumbTitle.textContent = product.name;
		breadCrumbCategory.textContent = product.category;

		productImage.src = product.image;
		productImage.alt = product.alt;

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

		// Populate product sizes

		productSize.innerHTML =
			'<option value="" selected disabled>Select size</option>';

		product.size.forEach(function (size) {
			const option = document.createElement("option");
			option.value = size;
			option.textContent = size;
			productSize.appendChild(option);
		});

		// Populate product colors

		productColor.innerHTML =
			'<option value="" selected disabled>Select color</option>';

		product.color.forEach(function (color) {
			const option = document.createElement("option");
			option.value = color;
			option.textContent = color;
			productColor.appendChild(option);
		});
	}

	// Get product ID from URL

	// Get product ID from URL

	const urlParams = new URLSearchParams(window.location.search);
	const productIdParam = urlParams.get("id");

	if (isProductDetailsPage) {
		const targetId = productIdParam ? Number(productIdParam) : products[0].id;

		const matchedProduct = products.find(function (product) {
			return product.id === targetId;
		});

		if (matchedProduct) {
			renderProducts(matchedProduct);

			// Add product to cart

			if (addToCart) {
				addToCart.addEventListener("click", function () {
					const selectedSize = productSize.value;
					const selectedColor = productColor.value;
					const selectedQuantity = Number(quantity.value);

					if (!selectedSize || !selectedColor) {
						alert("Please select your size and color.");
						return;
					}

					if (!Number.isInteger(selectedQuantity) || selectedQuantity < 1) {
						alert("Please enter a valid quantity.");
						quantity.value = 1;
						return;
					}

					const cartItem = {
						id: matchedProduct.id,
						name: matchedProduct.name,
						price: matchedProduct.price,
						image: matchedProduct.image,
						quantity: selectedQuantity,
						size: selectedSize,
						color: selectedColor,
					};

					const cart = getCart();

					const existingItem = cart.find(function (item) {
						return (
							item.id === cartItem.id &&
							item.size === cartItem.size &&
							item.color === cartItem.color
						);
					});

					if (existingItem) {
						existingItem.quantity += cartItem.quantity;
					} else {
						cart.push(cartItem);
					}

					saveCart(cart);
					const viewCart = confirm(
						"Product added successfully. Would you like to view your cart?",
					);

					if (viewCart) {
						window.location.href = "cart.html";
					}
				});
			}
		} else {
			console.error("Product ID does not match.");
		}
	}

	// Shop product cards

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

	// Pagination

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

	function renderCurrentPage() {
		if (!productGrid) return;

		const totalPages = getTotalPages();

		if (totalPages > 0 && currentPage > totalPages) {
			currentPage = totalPages;
		}

		const startIndex = (currentPage - 1) * productsPerPage;
		const endIndex = startIndex + productsPerPage;

		const revealProducts = filteredProducts.slice(startIndex, endIndex);

		productGrid.innerHTML = "";

		revealProducts.forEach(function (product) {
			renderShopProductCard(product);
		});

		if (revealProducts.length === 0) {
			productGrid.innerHTML = "<p class='text-center'>No products found.</p>";
		}

		if (pageIndicator) {
			pageIndicator.textContent = totalPages === 0 ? 0 : currentPage;
		}

		updatePaginationControls();
	}

	if (nextBtn) {
		nextBtn.addEventListener("click", function () {
			if (currentPage < getTotalPages()) {
				currentPage++;
				renderCurrentPage();
			}
		});
	}

	if (prevBtn) {
		prevBtn.addEventListener("click", function () {
			if (currentPage > 1) {
				currentPage--;
				renderCurrentPage();
			}
		});
	}

	if (productGrid) {
		renderCurrentPage();
	}

	// Search and filters

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

	if (searchProduct) {
		searchProduct.addEventListener("input", function () {
			applyFilters();
		});
	}

	if (filterByCategories) {
		filterByCategories.addEventListener("change", function () {
			selectedCategory = filterByCategories.value;
			applyFilters();
		});
	}

	// Sort products

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

	if (sortProduct) {
		sortProduct.addEventListener("change", function () {
			applyFilters();
		});
	}

	// Quantity controls

	if (increaseQuantity && quantity) {
		increaseQuantity.addEventListener("click", function () {
			const quantityValue = Number(quantity.value);

			if (!Number.isInteger(quantityValue) || quantityValue < 1) {
				quantity.value = 1;
				return;
			}

			quantity.value = quantityValue + 1;
		});
	}

	if (decreaseQuantity && quantity) {
		decreaseQuantity.addEventListener("click", function () {
			const quantityValue = Number(quantity.value);

			if (!Number.isInteger(quantityValue) || quantityValue <= 1) {
				quantity.value = 1;
				return;
			}

			quantity.value = quantityValue - 1;
		});
	}

	if (quantity) {
		quantity.addEventListener("input", function () {
			const quantityValue = Number(quantity.value);

			if (quantity.value === "" || !Number.isFinite(quantityValue)) {
				return;
			}

			quantity.value = Math.max(1, Math.floor(quantityValue));
		});

		quantity.addEventListener("blur", function () {
			const quantityValue = Number(quantity.value);

			if (!Number.isInteger(quantityValue) || quantityValue < 1) {
				quantity.value = 1;
			}
		});
	}

	// Shopping cart

	function getCart() {
		try {
			const storedCart = localStorage.getItem("cart");
			const cart = storedCart ? JSON.parse(storedCart) : [];

			return Array.isArray(cart) ? cart : [];
		} catch (error) {
			console.error("Unable to retrieve cart:", error);
			return [];
		}
	}

	function saveCart(cart) {
		try {
			localStorage.setItem("cart", JSON.stringify(cart));
		} catch (error) {
			console.error("Unable to save cart:", error);
			alert("Unable to save your cart. Please try again.");
		}
	}

	function renderCart() {
		if (!cartItemsContainer) return;

		const cart = getCart();

		cartItemsContainer.innerHTML = "";

		if (cart.length === 0) {
			if (cartEmpty) {
				cartEmpty.classList.remove("d-none");
			}

			if (cartContent) {
				cartContent.classList.add("d-none");
			}

			return;
		}

		if (cartEmpty) {
			cartEmpty.classList.add("d-none");
		}

		if (cartContent) {
			cartContent.classList.remove("d-none");
		}

		let subtotal = 0;

		cart.forEach(function (item, index) {
			const itemTotal = item.price * item.quantity;
			subtotal += itemTotal;

			const cartItem = document.createElement("div");
			cartItem.classList.add("card", "mb-3", "p-3");

			cartItem.innerHTML = `
				<div class="row align-items-center g-3">
					<div class="col-4 col-md-3">
						<img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
					</div>
					<div class="col-8 col-md-9">
						<div class="d-flex justify-content-between gap-2">
							<div>
								<h5>${item.name}</h5>
								<p class="mb-1">Size: ${item.size}</p>
								<p class="mb-1">Color: ${item.color}</p>
								<p class="fw-bold">${formatPrice(item.price)}</p>
							</div>
							<button class="btn btn-sm btn-outline-danger" data-action="remove" data-index="${index}">
								Remove
							</button>
						</div>
						<div class="d-flex justify-content-between align-items-center mt-3">
							<div class="btn-group">
								<button class="btn btn-outline-secondary" data-action="decrease" data-index="${index}">
									−
								</button>
								<span class="px-3 py-2">${item.quantity}</span>
								<button class="btn btn-outline-secondary" data-action="increase" data-index="${index}">
									+
								</button>
							</div>
							<strong>${formatPrice(itemTotal)}</strong>
						</div>
					</div>
				</div>
			`;

			cartItemsContainer.appendChild(cartItem);
		});

		if (cartSubtotal) {
			cartSubtotal.textContent = formatPrice(subtotal);
		}

		if (cartTotal) {
			cartTotal.textContent = formatPrice(subtotal);
		}
	}

	if (cartItemsContainer) {
		cartItemsContainer.addEventListener("click", function (e) {
			const button = e.target.closest("button[data-action]");

			if (!button) return;

			const cart = getCart();
			const index = Number(button.dataset.index);
			const action = button.dataset.action;

			if (!Number.isInteger(index) || !cart[index]) return;

			if (action === "increase") {
				cart[index].quantity++;
			} else if (action === "decrease") {
				if (cart[index].quantity > 1) {
					cart[index].quantity--;
				}
			} else if (action === "remove") {
				cart.splice(index, 1);
			}

			saveCart(cart);
			renderCart();
		});

		renderCart();
	}
}
