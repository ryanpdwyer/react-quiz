
function show(element) {
	const el  = document.getElementById(element);
	el.removeAttribute("hidden");
}


function hide(element) {
	const el  = document.getElementById(element);
	el.setAttribute("hidden", true);
}

function randomizeElements(listEl) {
	for (var i = listEl.children.length; i >= 0; i--) {
    listEl.appendChild(listEl.children[Math.random() * i | 0]);
	}
}

