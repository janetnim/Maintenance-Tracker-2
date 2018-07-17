// admin view filtered rejected requests
function adm_rej(){
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/disapprove", {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + localStorage.getItem("token")
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
}

adm_rej();

