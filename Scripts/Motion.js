// All GSAP motion lives here, separate from Script.js (like Charts.js in the Dashboard repo).
// Everything is skipped for people who turn on "reduce motion" in their system settings.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
	if (reduceMotion || !window.gsap) {
		showEverything();
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	pageEnter();
	heroName();
	reveals();
	coverReveals();
	cursorLabel();
	pageTransitions();
});

// Fallback: show anything that was waiting to animate
function showEverything() {
	document.documentElement.classList.remove("is-arriving");
	document.querySelectorAll("[data-reveal]").forEach((el) => { el.style.opacity = 1; });
}

// 1. Curtain lifts when a page loads
function pageEnter() {
	const curtain = document.querySelector(".page-curtain");
	if (!curtain) return;

	const root = document.documentElement;

	if (root.classList.contains("is-arriving")) {
		// arriving from another page on this site: start covered, then lift
		gsap.set(curtain, { yPercent: 0, visibility: "visible" });
		root.classList.remove("is-arriving");
		gsap.to(curtain, {
			yPercent: -100,
			duration: 0.7,
			ease: "power3.inOut",
			delay: 0.05,
			onComplete: () => gsap.set(curtain, { yPercent: 100, visibility: "hidden" }),
		});
	}
	sessionStorageSet("curtain", "0");
}

// 2. The signature moment: the name stretches open on load, then tightens as you scroll
function heroName() {
	const name = document.querySelector(".hero-name");
	if (!name) return;

	const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

	intro
		.fromTo(name,
			{ fontStretch: "75%", fontWeight: 300, opacity: 0, y: 40 },
			{ fontStretch: "100%", fontWeight: 800, opacity: 1, y: 0, duration: 1.6 })
		.to(name, { fontStretch: "75%", duration: 1.1, ease: "power3.inOut" }, "-=0.25");

	// after the intro, scroll position drives the width
	intro.eventCallback("onComplete", () => {
		gsap.to(name, {
			fontStretch: "100%",
			ease: "none",
			scrollTrigger: {
				trigger: name,
				start: "top 20%",
				end: "bottom top",
				scrub: 0.4,
			},
		});
	});
}

// 3. Text and blocks marked with data-reveal fade up into place
function reveals() {
	const heroItems = gsap.utils.toArray(".hero [data-reveal], .page-hero [data-reveal], .case-hero [data-reveal], .post-header [data-reveal]");

	gsap.fromTo(heroItems,
		{ opacity: 0, y: 24 },
		{ opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.35 });

	gsap.utils.toArray("[data-reveal]").forEach((el) => {
		if (heroItems.includes(el)) return;

		gsap.fromTo(el,
			{ opacity: 0, y: 32 },
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: "expo.out",
				scrollTrigger: { trigger: el, start: "top 88%", once: true },
			});
	});
}

// 4. Project covers open from the bottom with a slow zoom-out
function coverReveals() {
	gsap.utils.toArray("[data-cover]").forEach((cover) => {
		const img = cover.querySelector("img");

		gsap.fromTo(cover,
			{ clipPath: "inset(18% 6% 0% 6% round 10px)" },
			{
				clipPath: "inset(0% 0% 0% 0% round 10px)",
				ease: "power2.out",
				scrollTrigger: { trigger: cover, start: "top 95%", end: "top 45%", scrub: 0.6 },
			});

		if (img) {
			gsap.fromTo(img,
				{ scale: 1.15 },
				{
					scale: 1,
					ease: "none",
					scrollTrigger: { trigger: cover, start: "top bottom", end: "bottom top", scrub: true },
				});
		}
	});
}

// 5. "View case study" label follows the cursor over covers (mouse and trackpad only)
function cursorLabel() {
	const label = document.querySelector(".cursor-label");
	if (!label || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

	const moveX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3" });
	const moveY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3" });

	window.addEventListener("pointermove", (event) => {
		moveX(event.clientX);
		moveY(event.clientY);
	}, { passive: true });

	document.querySelectorAll("[data-cursor]").forEach((el) => {
		el.addEventListener("pointerenter", () => {
			label.textContent = el.dataset.cursor;
			gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
		});
		el.addEventListener("pointerleave", () => {
			gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
		});
	});
}

// 6. Curtain covers the screen before going to another page on this site
function pageTransitions() {
	const curtain = document.querySelector(".page-curtain");
	if (!curtain) return;

	document.querySelectorAll("a[href]").forEach((link) => {
		const url = new URL(link.href, location.href);
		const isInternal = url.origin === location.origin;
		const isSamePage = url.pathname === location.pathname && url.hash;
		const isFile = /\.(pdf|zip|png|jpe?g)$/i.test(url.pathname);

		if (!isInternal || isSamePage || isFile || link.target === "_blank") return;

		link.addEventListener("click", (event) => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
			event.preventDefault();

			sessionStorageSet("curtain", "1");
			gsap.fromTo(curtain,
				{ yPercent: 100, visibility: "visible" },
				{
					yPercent: 0,
					duration: 0.55,
					ease: "power3.inOut",
					onComplete: () => { location.href = url.href; },
				});
		});
	});

	// coming back with the browser's back button: make sure the page isn't covered
	window.addEventListener("pageshow", (event) => {
		if (event.persisted) gsap.set(curtain, { yPercent: 100, visibility: "hidden" });
	});
}

// storage can be blocked in private windows, so failures are ignored
function sessionStorageGet(key) {
	try { return sessionStorage.getItem(key); } catch (e) { return null; }
}

function sessionStorageSet(key, value) {
	try { sessionStorage.setItem(key, value); } catch (e) { /* ignore */ }
}
