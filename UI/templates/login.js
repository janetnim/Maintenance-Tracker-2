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
				window.location.href = "user_homepage.html"
			}else if(getItems().role === "admin"){
				window.location.href = "admin_homepage.html"
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
		if(data.message === "request made successfully"){
			alert(data.message)
			window.location.href = "user_homepage.html"
		}else{
			let err = document.getElementById('err-message')
			err.style.display = "block"
			err.innerHTML = data.message
		}
	})
	return false;
}

// user search a request function
function searchreq(){
	let search = document.getElementById("search_bar");
	let request_id = search.value;

	let responseMessage;

	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+request_id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getItems().token
		}	
	}).then(response => response.json())
	.then( data => {
		let requests = document.getElementById("requests").querySelector("tbody");
		
		if( data.message === "Request not found" ){
			alert("request not found")
		}else{
			let request = data.res;
			requests.innerHTML = 
			`
				<tr>
					<td>${ request.request_id }</td>
					<td>${ request.request }</td>
					<td>${ request.department }</td>
					<td>${ request.status }</td>
					<td>${ "<button onclick='modify("+request.request_id+")'>Edit</button"  }</td>
					<td>${ "<button onclick='delreq("+request.request_id+")'>Delete</button"  }</td>	
				</tr>
		`
		}
	})
}

// user view all requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests", {
	method: "GET",
	headers: {
	"Content-Type": "application/json",
	"Authorization": "Bearer " + getItems().token
		}}).then(response => response.json())
.then( data => {
	let requests = document.getElementById("requests").querySelector("tbody");
	requests.innerHTML = 
	`
		${ data.message === "No requests available"?`
			<h2 id="no_requests">No requests to display</h2>`:
			data.res.map( request => `
				<tr>
					<td>${ request.request_id }</td>
					<td>${ request.request }</td>
					<td>${ request.department }</td>
					<td>${ request.status }</td>
					<td>${ "<button onclick='modify("+request.request_id+")'>Edit</button"  }</td>
					<td>${ "<button onclick='delout("+request.request_id+")'>Delete</button"  }</td>	
				</tr>
			`).join("") }
	`;
});

//user can get feedback
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests", {
	method: "GET",
	headers: {
	"Content-Type": "application/json",
	"Authorization": "Bearer " + getItems().token
		}
	}).then(response => response.json())
.then( data => {
	let requests = document.getElementById("feedback").querySelector("tbody");
	requests.innerHTML = 
	`
		${ data.res.map( request => `
				<tr>
					<td>${ request.request_id }</td>
					<td>${ request.request }</td>
					<td>${ request.department }</td>
					<td>${ request.status }</td>	
				</tr>
			`).join("") }
	`;
});

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
		if(data.message==="Only a pending request can be modified."){
			alert("You cannot only edit a pending request")
		}else{
		alert("Request has been modifed")	
	}
		window.location.href = "user_homepage.html"
	})
	return false;
}

// set request_id to modify requests
function modify(request_id){
	localStorage.setItem("request_id", request_id);
	window.location.href = "request.html"
}

//filter requests
function filterRequests(input){
	var filter, table, i;
	 // map each of the tr's to the filterRow function.
	filter = input.value.toUpperCase();
	table = document.getElementById("tab")
	let rows = table.getElementsByTagName("tr"); 

	// get elements by tag name
	for(i=0; i<rows.length; i++){
		filterRow(rows[i], filter);
	}
}

// create a function to help in filtering 
function filterRow(tr, text){
    let columns = tr.getElementsByTagName("td");
    let textFound = false; // to check if the text was found in any of the columns

    for(var i=0; i<columns.length; i++){
    	if(columns[i].innerHTML.toUpperCase().indexOf(text) >= 0){
          textFound = true; // the text was found
        }
    }
    tr.style.display = textFound ? "" : "none"; // hide the row if the text was not found
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
 function delout(request_id){
 	var response=confirm("Are you sure you want to delete the request?");
	if (response==true){
		delreq(request_id)
	}else{
		alert("Welcome back!");
	}
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
	let requests = document.getElementById("admin_view").querySelector("tbody");
	requests.innerHTML = 
	`
		${ data.Request.map( request => `
				<tr>
					<td>${ request.request_id }</td>
					<td>${ request.request }</td>
					<td>${ request.department }</td>
					<td>${ request.personal_id }</td>
					<td>${ request.status }</td>
				</tr>
			`).join("") }
	`;
});

// admin dashboard requests
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + getItems().token
	}
}).then(response => response.json())
.then(data => {
	let requests = document.getElementById("admin_requests").querySelector("tbody");
	requests.innerHTML = 
	`
		${ data.Request.map( request => `
				<tr>
					<td>${ request.request_id }</td>
					<td>${ request.request }</td>
					<td>${ request.department }</td>
					<td>${ request.personal_id }</td>
					<td>${ request.status }</td>
					<td>${ "<button onclick='approve("+request.request_id+")'>Approve</button>" }</td>
					<td>${ "<button onclick='disapprove("+request.request_id+")'>Disapprove</button>" } </td>
					<td>${ "<button onclick='admin_delreq("+request.request_id+")'>Delete</button>" } </td>
				</tr>
			`).join("") }
	`;
});

// admin search a request function
function admin_search_req(){
	let search = document.getElementById("search_bar");
	let request_id = search.value;

	let responseMessage;

	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + getItems().token
		}	
	}).then(response => response.json())
	.then( data => {
		let requests = document.getElementById("admin_requests").querySelector("tbody");
		
		if( data.message === "Request does not exist" ){
			alert("Request not found")
		}else{
			let request = data.Request;
			requests.innerHTML = 
			`
				<tr>
					<td>${ request.request_id }</td>
					<td>${ request.request }</td>
					<td>${ request.department }</td>
					<td>${ request.personal_id }</td>
					<td>${ request.status }</td>
					<td>${ "<button onclick='approve("+request.request_id+")'>Approve</button>" }</td>
					<td>${ "<button onclick='disapprove("+request.request_id+")'>Disapprove</button>" } </td>
					<td>${ "<button onclick='admin_delreq("+request.request_id+")'>Delete</button>" } </td>
				</tr>
		`
		}
	})
}

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

		alert('Request approved')
		window.location.href = "admin_homepage.html"
		row.innerHTML = content;
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

		alert("Request disapproved")
		window.location.href = "admin_homepage.html"
		row.innerHTML = content;
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

		alert("Request resolved")
		window.location.href = "admin_approve.html"
		row.innerHTML = content;
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
    	window.location.href = "admin_homepage.html"
       	let row = document.getElementById("request_"+request_id);
		row.parentNode.removeChild(row);
		alert("Request successfully deleted")
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



