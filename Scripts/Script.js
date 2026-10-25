// Small interactions shared by every page. No jQuery needed.

document.addEventListener("DOMContentLoaded", () => {
	setupMenu();
	markCurrentPage();
	setupHeaderOnScroll();
	setYear();
});

// Mobile menu — handlers are attached once, so clicks never stack up
function setupMenu() {
	const button = document.querySelector(".menu-button");
	const nav = document.querySelector(".site-nav");
	if (!button || !nav) return;

	const setOpen = (open) => {
		button.setAttribute("aria-expanded", String(open));
		button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
		nav.classList.toggle("is-open", open);
		document.body.style.overflow = open ? "hidden" : "";
	};

	button.addEventListener("click", () => {
		setOpen(button.getAttribute("aria-expanded") !== "true");
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && nav.classList.contains("is-open")) {
			setOpen(false);
			button.focus();
		}
	});

	window.matchMedia("(min-width: 769px)").addEventListener("change", (event) => {
		if (event.matches) setOpen(false);
	});
}

// Underlines the nav link for the current section
function markCurrentPage() {
	const path = location.pathname.replace(/\.html$/, "").replace(/\/index$/, "/");

	document.querySelectorAll(".nav-link").forEach((link) => {
		const section = link.dataset.section;
		const isHome = section === "/" && (path === "/" || path.startsWith("/work"));
		const isSection = section !== "/" && path.startsWith(section);

		if (isHome || isSection) link.setAttribute("aria-current", "page");
	});
}

// Header slides away while scrolling down and returns when scrolling up
function setupHeaderOnScroll() {
	const header = document.querySelector(".site-header");
	if (!header) return;

	let lastY = window.scrollY;
	let ticking = false;

	window.addEventListener("scroll", () => {
		if (ticking) return;
		ticking = true;

		requestAnimationFrame(() => {
			const y = window.scrollY;
			const menuOpen = document.querySelector(".site-nav.is-open");
			header.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 200);
			lastY = y;
			ticking = false;
		});
	}, { passive: true });
}

function setYear() {
	document.querySelectorAll("[data-year]").forEach((el) => {
		el.textContent = new Date().getFullYear();
	});
}
