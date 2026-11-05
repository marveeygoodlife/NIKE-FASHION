"use strict";

// Get cart elements
const cartItemsContainer = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartContent = document.getElementById("cart-content");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");

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

// Handle cart item actions
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
