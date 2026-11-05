"use strict";

// Get product details elements
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

// Render product details
function renderProducts(product) {
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

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productIdParam = urlParams.get("id");
const productId = Number(productIdParam);

const matchedProduct = products.find(function (product) {
	return product.id === productId;
});

if (matchedProduct && productImage && productName) {
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
} else if (productName && productImage) {
	productName.textContent = "Product not found";
}
