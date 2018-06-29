// user singup method
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
		let err = document.getElementById('err-message')
		err.style.display = "block"
		err.innerHTML = data.message
		login(form);
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
		let err = document.getElementById('err-message')
		err.style.display = "block"
		err.innerHTML = data.message
		setItems(data.token, data.role.role);
		if(getItems().role === "user"){
		window.location.href = "user_homepage.html"
	}else if(getItems().role === "admin"){
		window.location.href = "admin_homepage.html"
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

function response(){
	if(!response.ok){
		throw new Error("Something went wrong..")
	}
	return response
}

function setItems(token, role){	
	localStorage.setItem('token', token);
	localStorage.setItem('role', role);
}

function getItems(){
	let token = localStorage.getItem('token')
	let role = localStorage.getItem('role')
	return {
		'token': token,
		'role': role
	}
}

// user post request function
function makereq(form){
	fetch('https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests', {
	  method: "post",
	  body: JSON.stringify(toJSON(form)),
	  headers: {
	  "Content-Type": "application/json",
	  "Authorization": "Bearer " + getItems().token
		}
	})
	.then(response => response.json())
	.catch(error => console.error('Error '+ error))
	.then(data => {
		let err = document.getElementById('err-message')
		err.style.display = "block"
		err.innerHTML = data.message
		if(data.message === "request made successfully"){
			alert(data.message)
			window.location.href = "view_req.html"
		}
	})
	return false;
}

// user search a request function
function searchreq(form){
	let request_id = document.getElementById("search_bar").value;

	req(request_id);

	return false;
}

// user gets a single request
function req(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+request_id, {
	method: "GET",
	headers: {
	"Content-Type": "application/json",
	"Authorization": "Bearer " + getItems().token
		}
	})
	.then(response => response.json())
	.catch(error => console.error('Error '+ error))
	.then(data => {
	    let request = data.res;
        content += "<tr id='request_"+request.request_id+"'>"+
        "<td>"+request.request_id+"</td><td>"+ request.request+
        "</td><td>"+request.department+"</td><td>"+request.status+
        "</td><td>"+request.personal_id+"</td><td><button onclick='modify("+request.request_id+")'>Edit</button>"+
        "</td><td><button onclick='delreq("+request.request_id+")'>Delete</button></td></tr>";

	document.getElementById("search_req").getElementsByTagName("tbody")[0].innerHTML = content;
	})
}

// user view all requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests", {
	method: "GET",
	headers: {
	"Content-Type": "application/json",
	"Authorization": "Bearer " + getItems().token
		}
})
.then(response => response.json())
.catch(error => console.error('Error '+ error))
.then(data => {
	let requests = data.res;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+"</td><td><button onclick='modify("+request.request_id+")'>Edit</button>"+
		"</td><td><button onclick='delreq("+request.request_id+")'>Delete</button></td></tr>";
	}

	document.getElementById("requests").getElementsByTagName("tbody")[0].innerHTML = content;
})

function del_out(){
	var response=confirm("Are you sure you want to delete this request?");
	if (response===true){
		req=delreq("+request.request_id+")
		alert(req)
	}else{
		alert("Request is not deleted");
	}
}

// user gets feedback
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests", {
	method: "GET",
	headers: {
	"Content-Type": "application/json",
	"Authorization": "Bearer " + getItems().token
		}
})
.then(response => response.json())
.catch(error => console.error('Error '+ error))
.then(data => {
	let requests = data.res;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+"</td></tr>";
	}

	document.getElementById("feedback").getElementsByTagName("tbody")[0].innerHTML = content;
})

// user gets a single request for editing
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+localStorage.getItem("request_id"), {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
})
.then(response => response.json())
.then(data => {
	document.getElementById("request").value = data.res.request;
})

// user can modify request
function editRequest(form){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+localStorage.getItem("request_id"), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getItems().token
		},
		body: JSON.stringify(toJSON(form))
	})
	.then(response => response.json())
	.then(data => {
		alert("Request has been modifed")
		window.location.href = "view_req.html"
		if(data.res.status === "Approve"){
			alert("Cannot edit approved request")
			window.location.href = "view_req.html"
		}	
	})
	return false;
}

// set request_id to modify requests
function modify(request_id){
	localStorage.setItem("request_id", request_id);
	window.location.href = "request.html"
}

// user delete request
function delreq(request_id){
    fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+request_id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getItems().token
        },
    })
    .then(response => response.json())
    .then(data => {
    	let row = document.getElementById("request_"+request_id);
		row.parentNode.removeChild(row);
        alert("Request successfully deleted")
    })
    return false;
}

// admin endpoints

// admin receives requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
}).then(response => response.json())
.then(data => {
	let requests = data.Request;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+
		"</td><td><button onclick='approve("+request.request_id+")''>Approve</button></td>"+
		"</td><td><button onclick='disapprove("+request.request_id+")''>Disapprove</button></td>"+
		"</td><td><button onclick='admin_delreq("+request.request_id+")'>Delete</button></td></tr>";
	}

	document.getElementById("admin_requests").getElementsByTagName("tbody")[0].innerHTML = content;
})

// admin view all unfiltered requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
}).then(response => response.json())
.then(data => {
	let requests = data.Request;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+
		"</td></tr>";
	}

	document.getElementById("admin_view").getElementsByTagName("tbody")[0].innerHTML = content;
})

// admin view filtered approved requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/approve", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
}).then(response => response.json())
.then(data => {
	let requests = data.Request;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+
		"</td><td><button onclick='resolve("+request.request_id+")'>Resolve</button></td></tr>";
	}

	document.getElementById("admin_approve").getElementsByTagName("tbody")[0].innerHTML = content;
})

// admin view filtered rejected requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/disapprove", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
}).then(response => response.json())
.then(data => {
	let requests = data.Request;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+
		"</td><td><button onclick='approve("+request.request_id+")'>Approve</button></td></tr>";
	}

	document.getElementById("admin_reject").getElementsByTagName("tbody")[0].innerHTML = content;
})

// admin can view filtered resolved requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/resolve", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
}).then(response => response.json())
.then(data => {
	let requests = data.Request;

	let content = "";
	for(let i = 0; i < requests.length; i++){
		let request = requests[i];
		content += "<tr id='request_"+request.request_id+"'>"+
		"<td>"+request.request_id+"</td><td>"+ request.request+
		"</td><td>"+request.department+"</td><td>"+request.status+
		"</td><td>"+request.personal_id+
		"</td></tr>";
	}

	document.getElementById("admin_resolve").getElementsByTagName("tbody")[0].innerHTML = content;
})

// admin approve request
function approve(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/approve", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getItems().token
		}
	}).then(response => response.json())
	.then(data => {
		let request = data.Request;
		let row = document.getElementById("request_"+request_id);

		let content = "<td>"+request.request_id+"</td><td>"+ request.description+
		"</td><td>"+request.product_name+"</td><td>"+request.status+
		"</td><td><button onclick='approve("+request.request_id+")''>Approve</button></td>";

		row.innerHTML = content;
		window.location.href = "admin_requests.html"
	});
}

// admin disapprove a request
function disapprove(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/disapprove", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getItems().token
		},
	}).then(response => response.json())
	.then(data => {
		let request = data.Request;
		let row = document.getElementById("request_"+request_id);

		let content = "<td>"+request.request_id+"</td><td>"+ request.description+
		"</td><td>"+request.product_name+"</td><td>"+request.status+
		"</td><td><button onclick='disapprove("+request.request_id+")''>Disapprove</button></td>";

		row.innerHTML = content;
		window.location.href = "admin_requests.html"
	});
}

// admin resolve request
function resolve(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/resolve", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getItems().token
		}
	}).then(response => response.json())
	.then(data => {
		let request = data.Request;
		let row = document.getElementById("request_"+request_id);

		let content = "<td>"+request.request_id+"</td><td>"+ request.description+
		"</td><td>"+request.product_name+"</td><td>"+request.status+
		"</td><td><button onclick='resolve("+request.request_id+")''>Resolve</button></td>";

		row.innerHTML = content;
		window.location.href = "admin_approve.html"
	});
}

// admin can delete a request
function admin_delreq(request_id){
    fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getItems().token
        },
    })
    .then(response => response.json())
    .then(data => {
       	let row = document.getElementById("request_"+request_id);
		row.parentNode.removeChild(row);
		alert("Request deleted")
    })
    return false;
}

// admin gets all users
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users", {
	method: "GET",
	headers: {
	"Content-Type": "application/json",
	"Authorization": "Bearer " + getItems().token
		}
})
.then(response => response.json())
.catch(error => console.error('Error '+ error))
.then(data => {
	let users = data.users;

	let content = "";
	for(let i = 0; i < users.length; i++){
		let user = users[i];
		content += "<tr><td>"+user.personal_id+"</td><td>"+ user.username+
		"</td><td>"+user.email+
		"</td><td>"+user.role+"</td></tr>";
	}

	document.getElementById("users").getElementsByTagName("tbody")[0].innerHTML = content;
})