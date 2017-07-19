// Internet Explorer 6-11 detection
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+ detection
var isEdge = !isIE && !!window.StyleMedia;


//Mobile navigation button

var navButton = document.querySelector('.mob-nav'),
navMenu = document.querySelectorAll('.nav')[0],
langMenuFr = document.querySelectorAll('.lang li')[0],
langMenuEn = document.querySelectorAll('.lang li')[1],
langMenuRu = document.querySelectorAll('.lang li')[2];


navButton.addEventListener('click', hide)
function hide(){
	navMenu.classList.toggle('hide-menu');
	setTimeout(function () {
		langMenuFr.classList.toggle('hide-lang-menu');
	}, 300);
	setTimeout(function () {
		langMenuEn.classList.toggle('hide-lang-menu');
	}, 400);
	setTimeout(function () {
		langMenuRu.classList.toggle('hide-lang-menu');
	}, 500);
	navButton.classList.toggle('moving');
};

/*animation frame hide*/

if (document.querySelector(".start-contaner")) {
	if (isIE||isEdge) {
		document.querySelector(".start-contaner svg").lastElementChild.innerHTML = ''
		setTimeout(function(){
		    document.querySelector(".start-contaner").style.opacity = 0;
		    setTimeout(function(){
		        document.querySelector("svg").style.transform = 'scaleY(0)';
		        setTimeout(function () {
		        	document.querySelector(".start-contaner").style.display = "none";
		        }, 450);
		    }, 50);
		}, 500);
	} else {
		setTimeout(function(){
		    document.querySelector(".start-contaner").style.opacity = 0;
		    setTimeout(function(){
		        document.querySelector("svg").style.transform = 'scaleY(0)';
		        setTimeout(function () {
		        	document.querySelector(".start-contaner").style.display = "none";
		        }, 800);
		    }, 200);
		}, 3000);
	}
};






//Google map for contacts
function initMap() {

	// Specify features and elements to define styles.
	var styleArray = [
	{
		featureType: "all",
		stylers: [
		{ hue: "#139700" },
		{ saturation: 50 }
		]
	},{
		featureType: 'water',
		elementType: 'geometry.fill',
		stylers: [{color: '#068aab'}]
	},{
		featureType: "road",
		elementType: "geometry",
		stylers: [
		{ hue: "#4f3102" }
		]
	},{
		featureType: "poi.business",
		elementType: "labels",
		stylers: [
		{ visibility: "off" }
		]
	}
	];

	// Create a map object and specify the DOM element for display.
	var dakarTaxi = {lat: 14.727550, lng: -17.436767}; 
	var map = new google.maps.Map(document.getElementsByClassName('map')[0], {
		center: dakarTaxi,
		scrollwheel: false,
		// Apply the map style array to the map.
		styles: styleArray,
		zoom: 15
	});
	var marker = new google.maps.Marker({
		map: map,
		position: dakarTaxi,
		icon: '/img/head-car-map.png',
		title: 'Dakar Taxi office'
	});

}


(function () {
	/*Active menu classes*/
	var docPath = document.URL,
	pageUrlArr = docPath.split("/"),
	pageName = pageUrlArr[pageUrlArr.length-1],
	langName = pageUrlArr[pageUrlArr.length-2],
	pagesArr = document.querySelectorAll(".menu li a"),
	liArr = document.querySelectorAll(".menu li");

	for (var i = pagesArr.length - 1; i >= 0; i--) {
		var hrefName = pagesArr[i].href.split('/')[pagesArr[i].href.split('/').length-1];
		if (hrefName == pageName){
			liArr[i].classList.add("active");
		} else if (!pageName){
			liArr[0].classList.add("active");
		}
	};

//--------------------------lang----------------
var lan = document.querySelectorAll(".lang li"),
//Home logo
goHome = document.querySelector('img[alt="Dakar Taxi"]');


goHome.addEventListener('click', home);
	function home (e) {
		if (langName.match(/[^fr)][^ru)]/)) {
	 window.location.assign("/");
	} else {
	 window.location.assign("/" + langName);
	}
	};


for (var i = lan.length - 1; i >= 0; i--) {
	lan[i].addEventListener("click", action);
	lan[i].children[0].href = "/" + lan[i].children[0].innerHTML + "/" + pageName;
	if (lan[i].children[0].innerHTML == "eng") {
			lan[i].children[0].href = "/" + pageName;
		}
	if (langName.match(/[^fr)][^ru)]/)) {
		if (lan[i].children[0].innerHTML == "eng") {
			lan[i].classList.add("active");
		}
	} 
	if (langName == lan[i].children[0].innerHTML) {
		lan[i].classList.add("active");
	};
};
function action (e) {
	console.log(e.target);
}
})();
//----------------Ajax query----------------------

	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize()
		}).done(function() {
			$('form').fadeOut('slow', function () { $('.panel .panel-body').css({'opacity': '1'}); } );
		});
		return false;
	});




// Google Analitics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49350407-3', 'auto');
  ga('send', 'pageview');







//IP
/*var ipData;
$.getJSON('//freegeoip.net/json/?callback=?', function(data) {
  ipData = data;
});
*/