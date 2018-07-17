//user makes a request
function makereq(form){
	fetch('https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests', {
	  method: "post",
	  body: JSON.stringify(toJSON(form)),
	  headers: {
	  "Content-Type": "application/json",
	  "Authorization": "Bearer " + localStorage.getItem("token")
		}
	})
	.then(response => response.json())
	.catch(error => console.error('Error '+ error))
	.then(data => {
		if(data.message === "request made successfully"){
			alert(data.message)
			window.location.href = "../templates/user_homepage.html"
		}else{
			let err = document.getElementById('err-message')
			err.style.display = "block"
			err.innerHTML = data.message
		}
	})
	return false;
}

function toJSON(form) {
    let formData = new FormData(form);
    let object = {};

    formData.forEach(function (value, key) {
        object[key] = value;
    });

    return object;
}

