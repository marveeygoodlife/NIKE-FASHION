"use strict";

// Shared cart functions
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

function updateCartCount() {
	const cartCount = document.getElementById("cart-count");

	if (!cartCount) return;

	const cart = getCart();

	const totalItems = cart.reduce(function (total, item) {
		return total + Number(item.quantity || 0);
	}, 0);

	cartCount.textContent = totalItems;
}

// Update the cart badge when a page loads
updateCartCount();

// Product functions only run when product data is available
if (typeof products !== "undefined") {
	// Get page elements
	const productGrid = document.getElementById("product-grid");
	const pageIndicator = document.getElementById("page-indicator");
	const prevBtn = document.getElementById("prev-btn");
	const nextBtn = document.getElementById("next-btn");

	const searchProduct = document.getElementById("search-product");
	const sortProduct = document.getElementById("sortProduct");
	const filterByCategories = document.getElementById("filterByCategories");

	const breadcrumbTitle = document.getElementById("breadcrumb-title");
	const breadCrumbCategory = document.getElementById("breadcrumb-category");

	const productImage = document.getElementById("product-image");
	const productName = document.getElementById("product-name");
	const productCategory = document.getElementById("product-category");
	const productRating = document.getElementById("product-rating");
	const productPrice = document.getElementById("product-price");
	const productDescription = document.getElementById("product-description");
	const productFullDescription = document.getElementById(
		"product-full-description",
	);

	const productSize = document.getElementById("product-size");
	const productColor = document.getElementById("product-color");
	const quantity = document.getElementById("quantity");

	const decreaseQuantity = document.getElementById("decrease-quantity");
	const increaseQuantity = document.getElementById("increase-quantity");
	const addToCart = document.getElementById("add-to-cart");

	const productBrand = document.getElementById("product-brand");
	const productCategoryDetail = document.getElementById(
		"product-category-detail",
	);
	const productColorDetail = document.getElementById("product-color-detail");
	const productSizesDetail = document.getElementById("product-sizes-detail");

	const cartItemsContainer = document.getElementById("cart-items");
	const cartEmpty = document.getElementById("cart-empty");
	const cartContent = document.getElementById("cart-content");
	const cartSubtotal = document.getElementById("cart-subtotal");
	const cartTotal = document.getElementById("cart-total");

	// Check the current page
	const isProductDetailsPage = Boolean(productImage && productName);
	const isCartPage = Boolean(cartItemsContainer);

	// Format prices
	function formatPrice(price) {
		return "₦" + price.toLocaleString("en-NG");
	}

	// Shop pagination
	const productsPerPage = 8;
	let currentPage = 1;

	// Search and filter
	let filteredProducts = [...products];
	let searchTerm = "";
	let selectedCategory = "all";

	// Calculate total pages
	function getTotalPages() {
		return Math.ceil(filteredProducts.length / productsPerPage);
	}

	// Render a single shop product
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

	// Render the current shop page
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

	// Sort filtered products
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

	// Shop search listener
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

	// Render product details
	function renderProducts(product) {
		if (!isProductDetailsPage) return;

		if (breadcrumbTitle) {
			breadcrumbTitle.textContent = product.name;
		}

		if (breadCrumbCategory) {
			breadCrumbCategory.textContent = product.category;
		}

		productImage.src = product.image;
		productImage.setAttribute("alt", product.alt);

		productName.textContent = product.name;

		if (productCategory) {
			productCategory.textContent = product.category;
		}

		if (productDescription) {
			productDescription.textContent = product.description;
		}

		if (productFullDescription) {
			productFullDescription.textContent = product.description;
		}

		if (productRating) {
			productRating.textContent = product.rating;
		}

		if (productPrice) {
			productPrice.textContent = formatPrice(product.price);
		}

		if (productBrand) {
			productBrand.textContent = product.brand;
		}

		if (productColorDetail) {
			productColorDetail.textContent = product.color.join(", ");
		}

		if (productSizesDetail) {
			productSizesDetail.textContent = product.size.join(", ");
		}

		if (productCategoryDetail) {
			productCategoryDetail.textContent = product.category;
		}

		if (productSize) {
			productSize.innerHTML =
				'<option value="" selected disabled>Select size</option>';

			product.size.forEach(function (size) {
				const option = document.createElement("option");
				option.value = size;
				option.textContent = size;
				productSize.appendChild(option);
			});
		}

		if (productColor) {
			productColor.innerHTML =
				'<option value="" selected disabled>Select color</option>';

			product.color.forEach(function (color) {
				const option = document.createElement("option");
				option.value = color;
				option.textContent = color;
				productColor.appendChild(option);
			});
		}
	}

	// Get product ID from the URL
	if (isProductDetailsPage) {
		const urlParams = new URLSearchParams(window.location.search);
		const productIdParam = urlParams.get("id");
		const productId = Number(productIdParam);

		const matchedProduct = products.find(function (product) {
			return product.id === productId;
		});

		if (matchedProduct) {
			renderProducts(matchedProduct);

			// Increase quantity
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

			// Decrease quantity
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

			// Validate quantity input
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
					updateCartCount();

					const viewCart = confirm(
						"Product added successfully. Would you like to view your cart?",
					);

					if (viewCart) {
						window.location.href = "cart.html";
					}
				});
			}
		} else {
			productName.textContent = "Product not found";
		}
	}

	// Render shopping cart
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

			if (cartSubtotal) {
				cartSubtotal.textContent = formatPrice(0);
			}

			if (cartTotal) {
				cartTotal.textContent = formatPrice(0);
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

	// Cart item actions
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
			updateCartCount();
			renderCart();
		});

		renderCart();
	}
}
