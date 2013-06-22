$("#full_form").submit(function(event) {
	event.preventDefault();
	var form = $(event.currentTarget);
	console.log("POST VALUE")
	console.log(form.serializeArray());
/*
	var url = form.attr("action");		
	$.post(url, form.serializeArray(), function(data) {
		
	});
*/
});
