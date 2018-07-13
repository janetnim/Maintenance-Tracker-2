function logout(){
	var response=confirm("Are you sure you want to log out?");
	if (response==true){
		window.location.href="../templates/user_login.html"
	}else{
	}
}