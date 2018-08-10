// Get all of the images that are marked up to lazy load
const images = document.querySelectorAll('.js-lazy-image');

const browser = getBrowser();

const browserInfo = document.querySelector('.browser-info');
browserInfo.innerHTML = "<b>Browser:</b> " + browser.name + "<br>" +
	"<b>Version:</b> " + browser.version + "<br>" +
	"<b>Platform:</b> " + browser.platform + "<br>" +
	"<b>Supports Intersection Observer:</b> " + browser.supportsIntersectionObserver;


const config = {
	root: null,
	rootMargin: "0px",
	threshold: []
};

let imageCount = images.length;
let observer;

// If we don't have support for intersection observer, loads the images immediately
if (!(browser.supportsIntersectionObserver)) {
	loadImagesImmediately(images);
} else {

	for (let i = 0; i <= 1.0; i += 0.01) {
		config.threshold.push(i);
	}

	// It is supported, load the images
	observer = new IntersectionObserver(onIntersectionContinuos, config);

	// foreach() is not supported in IE
	for (let i = 0; i < images.length; i++) {
		let image = images[i];
		if (image.classList.contains('js-lazy-image--handled')) {
			continue;
		}

		observer.observe(image);
	}
}

/**
 * Fetchs the image for the given URL
 * @param {string} url 
 */
function fetchImage (url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = url;
		image.onload = resolve;
		image.onerror = reject;
	});
}

/**
 * Preloads the image
 * @param {object} image 
 */
function preloadImage (image) {
	const src = image.dataset.src;
	if (!src) {
		return;
	}

	return fetchImage(src).then(() => { applyImage(image, src); });
}

/**
 * Load all of the images immediately
 * @param {NodeListOf<Element>} images 
 */
function loadImagesImmediately (images) {
	// foreach() is not supported in IE
	for (let i = 0; i < images.length; i++) {
		let image = images[i];
		preloadImage(image);
	}
}

/**
 * Disconnect the observer
 */
function disconnect () {
	if (!observer) {
		return;
	}

	observer.disconnect();
}

/**
 * On intersection
 * @param {array} entries 
 */
function onIntersection (entries) {
	console.log("intersecting");
	var visibleEntries = entries.filter(entry => entry.isIntersecting)
	var labelElem;

	for (let i = 0; i < visibleEntries.length; i++) {
		let image = entries[i].target;
		labelElem = nextByClass(image, "intersection-ratio");
		if (labelElem != null) {
			labelElem.innerHTML = (Math.ceil(entries[i].intersectionRatio * 100)) + "%";
		}
	}


	// Disconnect if we've already loaded all of the images
	if (imageCount === 0) {
		disconnect();
	}

	// Loop through the entries
	for (let i = 0; i < entries.length; i++) {
		let entry = entries[i];
		// Are we in viewport?
		if (entry.intersectionRatio > 0) {
			imageCount--;

			// Stop watching and load the image
			observer.unobserve(entry.target);
			preloadImage(entry.target);
		}
	}
}

function onIntersectionContinuos (entries) {
	console.log("intersecting");
	let labelClasses = ["top-left", "top-right", "bottom-right", "bottom-left"];

	for (let i = 0; i < entries.length; i++) {
		let image = entries[i].target;
		image.style.opacity = entries[i].intersectionRatio;
		let visiblePercentage = (Math.floor(entries[i].intersectionRatio * 100)) + "%";
		let label = {};

		for (let i = 0; i < labelClasses.length; i++) {
			label = nextByClass(image, labelClasses[i]);
			label.innerHTML = visiblePercentage;
		}

	};

	// Loop through the entries
	for (let i = 0; i < entries.length; i++) {
		let entry = entries[i];
		// Are we in viewport?
		if (entry.intersectionRatio > 0) {
			imageCount--;

			// Stop watching and load the image
			//observer.unobserve(entry.target);
			preloadImage(entry.target);
		}
	}

}


/**
 * Apply the image
 * @param {object} img 
 * @param {string} src 
 */
function applyImage (img, src) {
	// Prevent this from being lazy loaded a second time.
	img.classList.add('js-lazy-image--handled');
	img.src = src;
}



/**
 * Get browser info
 */
function getBrowser () {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return { name: 'IE', version: (tem[1] || '') };
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR|Edge\/(\d+)/)
		if (tem != null) { return { name: 'Opera', version: tem[1] }; }
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
	return {
		name: M[0],
		version: M[1],
		platform: navigator.platform,
		supportsIntersectionObserver: ('IntersectionObserver' in window) ? "yes" : "no"
	};
}

function hasClass (elem, cls) {
	var str = " " + elem.className + " ";
	var testCls = " " + cls + " ";
	return (str.indexOf(testCls) != -1);
}

function nextByClass (node, cls) {
	while (node = node.nextSibling) {
		if (hasClass(node, cls)) {
			return node;
		}
	}
	return null;
}


