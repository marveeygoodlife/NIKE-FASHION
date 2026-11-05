"use strict";

// Get cart from localStorage
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

// Save cart to localStorage
function saveCart(cart) {
	try {
		localStorage.setItem("cart", JSON.stringify(cart));
	} catch (error) {
		console.error("Unable to save cart:", error);
		alert("Unable to save your cart. Please try again.");
	}
}

// Update cart badge
function updateCartCount() {
	const cartCount = document.getElementById("cart-count");

	if (!cartCount) return;

	const cart = getCart();

	const totalItems = cart.reduce(function (total, item) {
		return total + Number(item.quantity || 0);
	}, 0);

	cartCount.textContent = totalItems;
}

// Format prices
function formatPrice(price) {
	return "₦" + price.toLocaleString("en-NG");
}

// Update cart badge when the page loads
updateCartCount();
