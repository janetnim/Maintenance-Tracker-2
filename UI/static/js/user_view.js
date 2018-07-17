// user view all requests
function view_All(){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests", {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + localStorage.getItem("token")
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
						<td>${ "<button onclick='delreq("+request.request_id+")'>Delete</button"  }</td>	
					</tr>
				`).join("") }
		`;
	});
}
view_All();

// user gets a single request for editing
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+localStorage.getItem("request_id"), {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + localStorage.getItem("token")
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
			"Authorization": "Bearer " + localStorage.getItem("token")
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
		window.location.href = "../templates/user_homepage.html"
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

// user delete request
function delreq(request_id){
    fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users/requests/"+request_id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
    })
    .then(response => response.json())
    .then(data => {
    	alert("Request successfully deleted")
    	window.location.reload()
    })
    return false;
}
