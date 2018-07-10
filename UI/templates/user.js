document.addEventListener("DOMContentLoaded", function(){
	let element = document.getElementById('user')
	element.style.display = "block"
	element.innerHTML = getItems().username
})