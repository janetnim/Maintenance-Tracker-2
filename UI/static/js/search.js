// set request_id to modify requests
function modify(request_id){
	localStorage.setItem("request_id", request_id);
	window.location.href = "../templates/request.html"
}

//filter dashboard requests when searching
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
    let textFound = false; 

    for(var i=0; i<columns.length; i++){
    	if(columns[i].innerHTML.toUpperCase().indexOf(text) >= 0){
          textFound = true;
        }
    }
    tr.style.display = textFound ? "" : "none";
}
