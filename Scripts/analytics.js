// Microsoft Clarity — paste your project ID once here and every page is tracked.
// Find it at clarity.microsoft.com → your project → Settings → Setup.
const CLARITY_PROJECT_ID = "";

(function () {
	if (!CLARITY_PROJECT_ID) return;

	// skip tracking while you develop locally
	const host = location.hostname;
	if (host === "localhost" || host === "127.0.0.1") return;

	(function (c, l, a, r, i, t, y) {
		c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
		t = l.createElement(r);
		t.async = 1;
		t.src = "https://www.clarity.ms/tag/" + i;
		y = l.getElementsByTagName(r)[0];
		y.parentNode.insertBefore(t, y);
	})(window, document, "clarity", "script", CLARITY_PROJECT_ID);
})();
