// admin can view filtered resolved requests
function adm_res(){
fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/requests/resolve", {
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
		"</td></tr>";
	}
	document.getElementById("admin_resolve").getElementsByTagName("tbody")[0].innerHTML = content;
})
}

adm_res();

