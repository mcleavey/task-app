// Delete task
$(".task-ul").on("click", ".X", function(event){
    console.log($(this).parent().text()+ " and ID: "+$(this).parent().find(".taskID").text());
    $.post("/act", {
       action: "delete",
       name: $(this).parent().text(),
       id: $(this).parent().find(".taskID").text()
       }).done(
            function(){
                console.log("Finished delete");
                location.href = location.href;
        });

	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	event.stopPropagation();
});

// Mark completed (grey, strike-through)
$(".task-ul").on("click", "li", function(){
    var markComplete = !($(this).hasClass("completed"));
    console.log("Mark as complete? "+markComplete);
	$(this).toggleClass("completed");
	$.post("/act", {
	 action: "complete",
	 completed: markComplete,
	 id: $(this).find(".taskID").text()
    });
});


// Add new task
$("input").keypress(function(event){
	if (event.which === 13) {
		$(this).parent().parent().find("ul").append("<li class=\"taskli\"><span class=\"X\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></span> "+$(this).val()+"</li>");
		console.log("About to call .post for add");
		$.post("/act",  {
		    action: "add",
            name: $(this).val(),
            completed: false,
            importancelevel: $(this).parent().find(".importance").text(),
            urgencylevel:  $(this).parent().find(".urgency").text(),
            username: "Christine"
            }).done(
            function(){
                console.log("Finished add");
                location.href = location.href;
        });
       
	}
});

$("ul").on("mouseover", "li", function(){
	console.log("hover");
	$(this).animate();
})

$(".fa-plus").click(function(){
	$(this).parent().parent().find("input").slideToggle();
	$(this).parent().parent().find("input").focus();
});
