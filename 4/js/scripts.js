var webpage = "";
function supportstorage() {
	if (typeof window.localStorage=='object')
		return true;
	else
		return false;
}

function handleSaveLayout() {
	var e = $(".demo").html();
	if (!stopsave && e != window.demoHtml) {
		stopsave++;
		window.demoHtml = e;
		saveLayout();
		stopsave--;
	}
}

var layouthistory;
function saveLayout(){
	var data = layouthistory;
	if (!data) {
		data={};
		data.count = 0;
		data.list = [];
	}
	if (data.list.length>data.count) {
		for (i=data.count;i<data.list.length;i++)
			data.list[i]=null;
	}
	data.list[data.count] = window.demoHtml;
	data.count++;
	if (supportstorage()) {
		localStorage.setItem("layoutdata",JSON.stringify(data));
	}
	layouthistory = data;
	//console.log(data);
	/*$.ajax({
		type: "POST",
		url: "/build/saveLayout",
		data: { layout: $('.demo').html() },
		success: function(data) {
			//updateButtonsVisibility();
		}
	});*/
}

 function downloadLayout(){

	$.ajax({
		type: "POST",
		url: "/build/downloadLayout",
		data: { layout: $('#download-layout').html() },
		success: function(data) { window.location.href = '/build/download'; }
	});
}

function downloadHtmlLayout(){
	$.ajax({
		type: "POST",
		url: "/build/downloadLayout",
		data: { layout: $('#download-layout').html() },
		success: function(data) { window.location.href = '/build/downloadHtml'; }
	});
}

function undoLayout() {
	var data = layouthistory;
	//console.log(data);
	if (data) {
		if (data.count<2) return false;
		window.demoHtml = data.list[data.count-2];
		data.count--;
		$('.demo').html(window.demoHtml);
		if (supportstorage()) {
			localStorage.setItem("layoutdata",JSON.stringify(data));
		}
		return true;
	}
	return false;
	/*$.ajax({
		type: "POST",
		url: "/build/getPreviousLayout",
		data: { },
		success: function(data) {
			undoOperation(data);
		}
	});*/
}

function redoLayout() {
	var data = layouthistory;
	if (data) {
		if (data.list[data.count]) {
			window.demoHtml = data.list[data.count];
			data.count++;
			$('.demo').html(window.demoHtml);
			if (supportstorage()) {
				localStorage.setItem("layoutdata",JSON.stringify(data));
			}
			return true;
		}
	}
	return false;
	/*
	$.ajax({
		type: "POST",
		url: "/build/getPreviousLayout",
		data: { },
		success: function(data) {
			redoOperation(data);
		}
	});*/
}

function handleJsIds() {
	handleModalIds();
	handleAccordionIds();
	handleCarouselIds();
	handleTabsIds();
}
function handleAccordionIds() {
	var e = $(".demo #myAccordion");
	var t = randomNumber();
	var n = "accordion-" + t;
	var r;
	e.attr("id", n);
	e.find(".accordion-group").each(function(e, t) {
		r = "accordion-element-" + randomNumber();
		$(t).find(".accordion-toggle").each(function(e, t) {
			$(t).attr("data-parent", "#" + n);
			$(t).attr("href", "#" + r);
		});
		$(t).find(".accordion-body").each(function(e, t) {
			$(t).attr("id", r);
		});
	});
}
function handleCarouselIds() {
	var e = $(".demo #myCarousel");
	var t = randomNumber();
	var n = "carousel-" + t;
	e.attr("id", n);
	e.find(".carousel-indicators li").each(function(e, t) {
		$(t).attr("data-target", "#" + n);
	});
	e.find(".left").attr("href", "#" + n);
	e.find(".right").attr("href", "#" + n);
}
function handleModalIds() {
	var e = $(".demo #myModalLink");
	var t = randomNumber();
	var n = "modal-container-" + t;
	var r = "modal-" + t;
	e.attr("id", r);
	e.attr("href", "#" + n);
	e.next().attr("id", n);
}
function handleTabsIds() {
	var e = $(".demo #myTabs");
	var t = randomNumber();
	var n = "tabs-" + t;
	e.attr("id", n);
	e.find(".tab-pane").each(function(e, t) {
		var n = $(t).attr("id");
		var r = "panel-" + randomNumber();
		$(t).attr("id", r);
		$(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r);
	});
}
function randomNumber() {
	return randomFromInterval(1, 1e6);
}
function randomFromInterval(e, t) {
	return Math.floor(Math.random() * (t - e + 1) + e);
}
function gridSystemGenerator() {
	$(".lyrow .preview input").bind("keyup", function() {
		var e = 0;
		var t = "";
		var n = $(this).val().split(" ", 12);
		$.each(n, function(n, r) {
			e = e + parseInt(r);
			t += '<div class="col-sm-12 col-md-' + r + ' column"></div>';
		});
		if (e == 12) {
			$(this).parent().next().children().html(t);
			$(this).parent().prev().show();
		} else {
			$(this).parent().prev().hide();
		}
	});
}
function configurationElm(e, t) {
	$(".demo").delegate(".configuration > a", "click", function(e) {
		e.preventDefault();
		var t = $(this).parent().next().next().children();
		$(this).toggleClass("active");
		t.toggleClass($(this).attr("rel"));
	});
	$(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {
		e.preventDefault();
		var t = $(this).parent().parent();
		var n = t.parent().parent().next().next().children();
		t.find("li").removeClass("active");
		$(this).parent().addClass("active");
		var r = "";
		t.find("a").each(function() {
			r += $(this).attr("rel") + " ";
		});
		t.parent().removeClass("open");
		n.removeClass(r);
		n.addClass($(this).attr("rel"));
	});
}
function removeElm() {
	$(".demo").delegate(".remove", "click", function(e) {
		e.preventDefault();
		$(this).parent().remove();
		if (!$(".demo .lyrow").length > 0) {
			clearDemo();
		}
	});
}
function clearDemo() {
	$(".demo").empty();
	layouthistory = null;
	if (supportstorage())
		localStorage.removeItem("layoutdata");
}
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};
function removeMenuClasses() {
	$("#menu-layoutit li button").removeClass("active");
}
function changeStructure(e, t) {
	$("#download-layout ." + e).removeClass(e).addClass(t);
}
function cleanHtml(e) {
	if($(e).children().attr('id') !== undefined){
		$(e).parent().append("<div id='Quiz'></div>");
	}
	$(e).parent().append($(e).children().html());
}
function resetBtnCopie(value){
	navigator.clipboard.writeText(value)
	$("#copieButton").html('Copied!');
	setTimeout(() => {
		$("#copieButton").html('<i class="fa fa-copy mr-1"></i> Copy code !');
	}, 1000);
}
function downloadLayoutSrc() {
	var e = "";
	$("#download-layout").children().html($(".demo").html());

	var t = $("#download-layout").children();
	t.find(".preview, .configuration, .drag, .remove").remove();
	t.find(".lyrow").addClass("removeClean");
	t.find(".box-element").addClass("removeClean");

	t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this);
	});

	t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this);
	});

	t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this);
	});
	t.find(".lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this);
	});

	t.find(".lyrow .removeClean").each(function() {
		cleanHtml(this);
	});
	t.find(".removeClean").each(function() {
		cleanHtml(this);
	});

	t.find(".removeClean").remove();

	$("#download-layout .column").removeClass("ui-sortable");
	$("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
	changeStructure("container-fluid", "container");
	if ($("#download-layout .container").length > 0) {
		changeStructure("row-fluid", "row");
	}

	$("#fluidPage").removeClass("active");
	$("#fixedPage").addClass("active");
	formatSrc = $("#download-layout").html()
	formatSrc = formatSrc.replaceAll(' contenteditable="true"', '');
	$("#download-layout").html();
	$("#downloadModal textarea").empty();

		  formatSrc = formatSrc.trim();
		  console.log(formatSrc.substring(24,formatSrc.length-6).trim())
	$("#downloadModal textarea").val(formatSrc.substring(24,formatSrc.length-6).trim());

	webpage = formatSrc;
	resetBtnCopie(formatSrc.substring(24,formatSrc.length-6).trim())


}

var currentDocument = null;
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;
var demoHtml = $(".demo").html();
var currenteditor = null;
// $(window).resize(function() {
// 	$("body").css("min-height", $(window).height() - 90);
// 	$(".demo").css("min-height", $(window).height() - 160)
// });

function restoreData(){
	if (supportstorage()) {
		layouthistory = JSON.parse(localStorage.getItem("layoutdata"));
		if (!layouthistory) return false;
		window.demoHtml = layouthistory.list[layouthistory.count-1];
		if (window.demoHtml) $(".demo").html(window.demoHtml);
	}
}

function initContainer(){
	$(".demo, .demo .column").sortable({
		connectWith: ".column",
		opacity: .35,
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		stop: function(e,t) {
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	configurationElm();
	$.fn.modal.Constructor.prototype.enforceFocus = function() {
		modal_this = this
		$(document).on('focusin.modal', function (e) {
		  if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
		  && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
		  && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
			modal_this.$element.focus()
		  }
		})
	  };
}
$(document).ready(function() {
	restoreData();
	var contenthandle = CKEDITOR.replace( 'contenteditor' ,{
		language: 'fr',
		contentsCss: ['css/bootstrap-combined.min.css'],
		allowedContent: true
	});
	// $("body").css("min-height", $(window).height() - 50);
	// $(".demo").css("min-height", $(window).height() - 130);
	$(".sidebar-nav .lyrow").draggable({
		connectToSortable: ".demo",
		helper: "clone",
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400);
		},
		stop: function(e, t) {
			$(".demo .column").sortable({
				opacity: .35,
				connectWith: ".column",
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	$(".sidebar-nav .box").draggable({
		connectToSortable: ".column",
		helper: "clone",
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400);
		},
		stop: function() {
			handleJsIds();
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}

	});

	initContainer();
	$('body.edit .demo').on("click","[data-target=#editorModal]",function(e) {
		e.preventDefault();
	//	$(".editorTextArea").show();
		currenteditor = $(this).parent().parent().find('.view');
		var eText = currenteditor.html();
		contenthandle.setData(eText);
	});
	$("#savecontent").click(function(e) {
		e.preventDefault();
	//	$(".editorTextArea").hide();
	console.log(contenthandle.getData())
		currenteditor.html(contenthandle.getData());
	});
	$("[data-target=#downloadModal]").click(function(e) {
		e.preventDefault();
		downloadLayoutSrc();
	});
	$("[data-target=#shareModal]").click(function(e) {
		e.preventDefault();
		handleSaveLayout();
	});
	$("#download").click(function() {
		downloadLayout();
		return false;
	});
	$("#downloadhtml").click(function() {
		downloadHtmlLayout();
		return false;
	});
	$("#edit").click(function() {
		$("body").removeClass("devpreview sourcepreview");
		$("body").addClass("edit");
		removeMenuClasses();
		$(this).addClass("active");
		return false;
	});
	$("#clear").click(function(e) {
		e.preventDefault();
		clearDemo();
	});
	$("#devpreview").click(function() {
		$("body").removeClass("edit sourcepreview");
		$("body").addClass("devpreview");
		removeMenuClasses();
		$(this).addClass("active");
		return false;
	});
	$("#sourcepreview").click(function() {
		$("body").removeClass("edit");
		$("body").addClass("devpreview sourcepreview");
		removeMenuClasses();
		$(this).addClass("active");
		return false;
	});
	$("#fluidPage").click(function(e) {
		e.preventDefault();
		changeStructure("container", "container-fluid");
		$("#fixedPage").removeClass("active");
		$(this).addClass("active");
		downloadLayoutSrc();
	});
	$("#fixedPage").click(function(e) {
		e.preventDefault();
		changeStructure("container-fluid", "container");
		$("#fluidPage").removeClass("active");
		$(this).addClass("active");
		downloadLayoutSrc();
	});
	$(".nav-header").click(function() {
		$(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
		$(this).next().slideDown();
	});
	$('#undo').click(function(){
		stopsave++;
		if (undoLayout()) initContainer();
		stopsave--;
	});
	$('#redo').click(function(){
		stopsave++;
		if (redoLayout()) initContainer();
		stopsave--;
	});
	removeElm();
	gridSystemGenerator();
	setInterval(function() {
		handleSaveLayout();
	}, timerSave);
        var prevalue_sv = $('.sidebar-nav').css('overflow');
        $('.popover-info').hover(function(){
               $('.sidebar-nav').css('overflow', 'inherit'); 
        }, function(){
               $('.sidebar-nav').css('overflow', prevalue_sv);
        });
});

function saveHtml()
			{
            var cpath = window.location.href;
            cpath = cpath.substring(0, cpath.lastIndexOf("/"));
			webpage = '<html>\n<head>\n<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">\n<link href="'+cpath+'/css/bootstrap.min.css" rel="stylesheet" media="screen">\n<link href="'+cpath+'/css/other.css" rel="stylesheet">\n<link href="'+cpath+'/css/docs.min.css" rel="stylesheet" media="screen">\n<link href="'+cpath+'/css/toolbox.css" rel="stylesheet" media="stylesheet">\n</head>\n<body>\n'+ webpage +'\n<script type="text/javascript" src="'+cpath+'/js/jquery-2.0.0.min.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/jquery-ui.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>\n<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.8.2/umd/popper.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/bootstrap.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/scrollspy.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/tab.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/dropdown.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/modal.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/collapse.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/popover.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/tooltip.js"></script>\n<script type="text/javascript" src="'+cpath+'/js/docs.min.js"></script>\n</body></html>';
			/* FM aka Vegetam Added the function that save the file in the directory Downloads. Work only to Chrome Firefox And IE*/
			if (navigator.appName =="Microsoft Internet Explorer" && window.ActiveXObject)
			{
			var locationFile = location.href.toString();
			var dlg = false;
			with(document){
			ir=createElement('iframe');
			ir.id='ifr';
			ir.location='about.blank';
			ir.style.display='none';
			body.appendChild(ir);
			with(getElementById('ifr').contentWindow.document){
			open("text/html", "replace");
			charset = "utf-8";
			write(webpage);
			close();
			document.charset = "utf-8";
			dlg = execCommand('SaveAs', false, locationFile+"webpage.html");
			}
    return dlg;
			}
			}
			else{
			webpage = webpage;
			var blob = new Blob([webpage], {type: "text/html;charset=utf-8"});
			saveAs(blob, "webpage.html");
		}
		}