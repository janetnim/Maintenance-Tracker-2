// admin dashboard requests
function admin_dash(){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("token")
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
}
admin_dash();

//admin approves a request
function approve(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/approve", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("token")
		}
	}).then(response => response.json())
	.then(data => {
		let request = data.Request;
		let row = document.getElementById("request_"+request_id);

		let content = "<td>"+request.request_id+"</td><td>"+ request.description+
		"</td><td>"+request.product_name+"</td><td>"+request.status+
		"</td><td><button onclick='approve("+request.request_id+")''>Approve</button></td>";

		alert('Request approved')
		window.location.href = "../templates/admin_homepage.html"
		row.innerHTML = content;
	});
}

// admin disapproves a request
function disapprove(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/disapprove", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("token")
		},
	}).then(response => response.json())
	.then(data => {
		let request = data.Request;
		let row = document.getElementById("request_"+request_id);

		let content = "<td>"+request.request_id+"</td><td>"+ request.description+
		"</td><td>"+request.product_name+"</td><td>"+request.status+
		"</td><td><button onclick='disapprove("+request.request_id+")''>Disapprove</button></td>";

		alert("Request disapproved")
		window.location.href = "../templates/admin_homepage.html"
		row.innerHTML = content;
	});
}

// admin resolves a request
function resolve(request_id){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/resolve", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("token")
		}
	}).then(response => response.json())
	.then(data => {
		let request = data.Request;
		let row = document.getElementById("request_"+request_id);

		let content = "<td>"+request.request_id+"</td><td>"+ request.description+
		"</td><td>"+request.product_name+"</td><td>"+request.status+
		"</td><td><button onclick='resolve("+request.request_id+")''>Resolve</button></td>";

		alert("Request resolved")
		window.location.href = "../templates/admin_approve.html"
		row.innerHTML = content;
	});
}


// admin can delete a request
function admin_delreq(request_id){
    fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/"+request_id+"/delete", {
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
