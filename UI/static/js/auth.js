// user sign up method
function signup(form){
	fetch('https://maintenance-tracker-2.herokuapp.com/api/v2/auth/signup', {
	  method: "post",
	  body: JSON.stringify(toJSON(form)),
	  headers: {
	  "Content-Type": "application/json"
		}
	})
	.then(response => response.json())
	.catch(error => console.error('Error '+ error))
	.then(data => {
		if(data.message !== "User successfully signed up"){
			let err = document.getElementById('err-message')
			err.style.display = "block"
			err.innerHTML = data.message
		}else{
			login(form);
		}
	})
	return false;
} 

// admin/user login method
function login(form){
	fetch('https://maintenance-tracker-2.herokuapp.com/api/v2/auth/login', {
	  method: "post",
	  body: JSON.stringify(toJSON(form)),
	  headers: {
	  "Content-Type": "application/json"
		}
	})
	.then(response => response.json())
	.catch(error => console.error('Error '+ error))
	.then(data => {
		if(data.message !== "You have logged in successfully"){
			let err = document.getElementById('err-message')
			err.style.display = "block"
			err.innerHTML = data.message
		}else{
			setItems(data.token, data.role.role, data.username.username);
			if(getItems().role === "user"){
				window.location.href = "../templates/user_homepage.html"
			}else if(getItems().role === "admin"){
				window.location.href = "../templates/admin_homepage.html"
			}
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

//return error message response
function response(){
	if(!response.ok){
		throw new Error("Something went wrong..")
	}
	return response
}

function setItems(token, role, username){	
	localStorage.setItem('token', token);
	localStorage.setItem('role', role);
	localStorage.setItem('username', username);	
}

function getItems(){
	let token = localStorage.getItem('token')
	let role = localStorage.getItem('role')
	let username = localStorage.getItem('username')
	return {
		'token': token,
		'role': role,
		'username': username
	}
}
