$.fn.center = function() {
	this.css("top", Math.max(0, ((($(window).height()) - $(this).outerHeight())/2) - 200) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth())/2)) + "px");
	return this;
}

$(function() {

	// Load the Scalar API and cache it.
	$.ajax({
		url: "/static/js/scalarapi.js",
		dataType: "script",
		cache: true
	});

	// Initialise tooltips
	/* Note: The standard Lexos tooltip will have the following html:

	   <i class="fa fa-question-circle lexos-tooltip-trigger" data-toggle="tooltip"\
	    data-html="true" data-placement="right" data-container="body" title="Some content"\
	    style=""></i>

	   @style may be used to adjust the size and placement of the trigger icon.
	   The default is margin-right:10px;font-size:14px;.
	*/

	$('[data-toggle="tooltip"]').tooltip();

	// Initialise popovers -- mouseleave handling from http://www.bootply.com/98529

	/* Note: The standard Lexos popover will have the following html:

	   <i class="fa fa-question-circle lexos-popover-trigger" data-trigger="hover" 
	   data-html="true" data-toggle="popover" data-placement="right" data-container="body" 
	   data-content="Some content" style="" title=""></i>

	   @style may be used to give to adjust the size and placement of the trigger icon.
	   @title may be used to give the popover a header.
	*/

  	$("[data-toggle=popover]").popover({
	  	trigger: 'manual',
	  	animate: false,
	  	html: true,
	  	placement: 'right',
	  	template: 
	  	  '<div class="popover" onmouseover="$(this).mouseleave(function() {$(this).hide();});">\
	  	  	<div class="arrow"></div>\
	  	  	<div class="popover-inner">\
	  	  		<h3 class="popover-title"></h3>\
	  	  		<div class="popover-content"><p></p></div>\
	  	  	</div>\
	  	  </div>'
	}).click(function(e) {
		e.preventDefault();
	}).mouseenter(function(e) {
		$(this).popover('show');
	});

	// Handle exceptions for submitting forms and display error messages on screen
	$("form").submit(function() {
		if ($('#num_active_files').val() == "0") {
			$('#error-message').text("You must have active documents to proceed!");
			$('#error-message').show().fadeOut(3000); // Use easeInOutCubic effect can cause program crash on analyzer pages

			$("#status-prepare").hide();
			$("#status-analyze").hide();
			// $('<div id="error-warning">You must have active files to proceed. Please select one or more files on the Select screen.</div>').dialog({
			// 	title: '<span class="ui-icon ui-icon-alert"></span> Error!'
			// });
			return false;
		} else
			return true;
	});

	// Add "selected" class to parent of selected link
	$(".sublist li .selected").parents('.headernavitem').addClass("selected");

	// display/hide expandable divs here
	$(".has-expansion .icon-arrow-right").click(function() {
		$(this).toggleClass("showing");
		
		$(this).parent('legend').siblings('.expansion').slideToggle(500);
	});

	// Gray out all disabled inputs
	$.each($('input'), function() {
		if ($(this).prop('disabled')) {
			$(this).parent('label').addClass('disabled');
		}
	});

	// Redirect all clicks on "Upload Buttons" to their file upload input
	$('.upload-bttn').click(function() {
		$(this).siblings('input[type=file]').click();
	});

	// Show the nested submenu of clustering when mouse hover over the corresponding navbar, otherwise hide the nested menu
	$("#clustering-menu, #clustering-submenu").mouseover(function(){
		$("#clustering-submenu").css({"opacity": 1, "visibility": "visible"});
	}).mouseleave(function(){
		$("#clustering-submenu").css({"opacity": 0, "visibility": "hidden"});
	});

	// Highlight the nested label of the navBar when nested pages are active
	if ($(".nestedElement").hasClass("selected")){
		$(".nestedLabel").addClass("selected");
	}

});

function getFormValues() {
	/* Gathers all the form values and returns them as a FormData object. In Flask, 
	access form values through request.form and files through request.files. Returns 
	a JSON object. */

	var formData = new FormData($('form')[0]);

	$.ajax({
	  url: '/previewScrubbing',
	  type: 'POST',
	  processData: false, // important
	  contentType: false, // important
	  data: formData,
	  "error": function () {alert("error");}
	}).done(function(response) {
		response = JSON.parse(response);
		return response;
	});
}