/* Part A: Product Data */
const products = [
	{
		id: 1,
		name: "Seiko Watch",
		category: "Jewelry",
		price: 430000,
		image: "/images/seiko-watch.jpg",
		alt: "Stylish Seiko wristwatch with a classic design, perfect for everyday wear and special occasions",
		description:
			"Complete your look with this elegant Seiko wristwatch, designed to combine timeless style with everyday functionality. Perfect for work, casual outings, and special occasions, it adds a refined touch to any outfit.",
		badge: "New",
		brand: "Seiko",
		size: ["Small", "Medium", "Large", "One Size"],
		color: ["Black", "Gold", "Brown"],
	},
	{
		id: 2,
		name: "Elegant Leather Handbag",
		category: "Bags",
		price: 52000,
		image:
			"https://images.unsplash.com/photo-1645276241987-7a7c14bf88f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhhbmRiYWd8ZW58MHwwfDB8fHww",
		alt: "Elegant women's leather handbag with a stylish design, perfect for everyday use and special occasions",
		description: "Elegant women's leather handbag",
		badge: "New",
		brand: "Nike Fashion",
		size: ["Mini", "Small", "Medium", "Large"],
		color: ["Brown", "Black", "Pink"],
	},
	{
		id: 3,
		name: "Classic Women's Dress",
		category: "Dresses",
		price: 190000,
		image:
			"https://images.unsplash.com/photo-1652501069751-9b122147de17?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fGRyZXNzfGVufDB8MHwwfHx8MA%3D%3D",
		alt: "Classic women’s dress featuring a timeless design and elegant style.",
		description:
			"Embrace timeless elegance with this classic women’s dress, designed to offer a sophisticated and effortlessly stylish look. Perfect for work, special occasions, or everyday wear, it combines versatility and elegance to complement any wardrobe..",
		badge: "New",
		brand: "Nike Fashion",
		size: ["S", "M", "L", "XL", "XXL"],
		color: ["White", "Black", "Red"],
	},
	{
		id: 4,
		name: "Gold Layered Necklace",
		category: "Jewelry",
		price: 500000,
		image:
			"https://images.unsplash.com/photo-1787769500023-197fa5921f43?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		alt: "Gold layered necklace with delicate chains in an elegant, stylish design",
		description:
			"Elevate your style with this elegant gold layered necklace, featuring delicate chains that create a chic, sophisticated look. Perfect for everyday wear, special occasions, or adding a touch of timeless elegance to any outfit",
		badge: "New",
		brand: "Nike Fashion",
		size: ["One Size"],
		color: ["Gold"],
	},
	{
		id: 5,
		name: "Chic Women Hills",
		category: "Shoes",
		price: 120000,
		image: "/images/women-shoe.jpg",
		alt: "Elegant women’s heels featuring a stylish design, perfect for formal occasions and special events",
		description:
			"Step out in style with these elegant women’s heels, designed to add sophistication and a touch of glamour to any outfit. Perfect for formal events, parties, weddings, or special occasions, they effortlessly combine timeless elegance with feminine charm.",
		badge: "New",
		brand: "Nike Fashion",
		size: ["35", "36", "37", "38", "39", "40"],
		color: ["Black", "White", "Red", "Navy Blue"],
	},
	{
		id: 6,
		name: "Classic Leather Jacket",
		category: "Jackets",
		price: 90000,
		image:
			"https://images.unsplash.com/photo-1562070354-930df66ead59?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM0fHxkcmVzcyUyMG9uJTIwbWFubmVxdWlufGVufDB8MHwwfHx8MA%3D%3D",
		alt: " Leather jacket with a sleek, stylish design for women.",
		description:
			"Make a bold statement with this stylish  leather jacket, crafted for a sleek and confident look. Perfect for casual outings, evenings, and adding a vibrant edge to any outfit.",
		badge: "New",
		brand: "Nike Fashion",
		size: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
		color: ["Red", "Black", "Crimson", "Beige"],
	},
];
