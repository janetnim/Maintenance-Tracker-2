// admin gets all users
function admin_users(){
	fetch("https://maintenance-tracker-2.herokuapp.com/api/v2/users", {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + localStorage.getItem("token")
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
}

admin_users();

