function hide(){navMenu.classList.toggle("hide-menu"),setTimeout(function(){langMenuFr.classList.toggle("hide-lang-menu")},300),setTimeout(function(){langMenuEn.classList.toggle("hide-lang-menu")},400),setTimeout(function(){langMenuRu.classList.toggle("hide-lang-menu")},500),navButton.classList.toggle("moving")}function initMap(){var e=[{featureType:"all",stylers:[{hue:"#139700"},{saturation:50}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#068aab"}]},{featureType:"road",elementType:"geometry",stylers:[{hue:"#4f3102"}]},{featureType:"poi.business",elementType:"labels",stylers:[{visibility:"off"}]}],t={lat:14.72755,lng:-17.436767},n=new google.maps.Map(document.getElementsByClassName("map")[0],{center:t,scrollwheel:!1,styles:e,zoom:15});new google.maps.Marker({map:n,position:t,icon:"./img/head-car-map.png",title:"Dakar Taxi office"})}var isIE=!!document.documentMode,isEdge=!isIE&&!!window.StyleMedia,navButton=document.querySelector(".mob-nav"),navMenu=document.querySelectorAll(".nav")[0],langMenuFr=document.querySelectorAll(".lang li")[0],langMenuEn=document.querySelectorAll(".lang li")[1],langMenuRu=document.querySelectorAll(".lang li")[2];navButton.addEventListener("click",hide),document.querySelector(".start-contaner")&&(isIE||isEdge?(document.querySelector(".start-contaner svg").lastElementChild.innerHTML="",setTimeout(function(){document.querySelector(".start-contaner").style.opacity=0,setTimeout(function(){document.querySelector("svg").style.transform="scaleY(0)",setTimeout(function(){document.querySelector(".start-contaner").style.display="none"},450)},50)},500)):setTimeout(function(){document.querySelector(".start-contaner").style.opacity=0,setTimeout(function(){document.querySelector("svg").style.transform="scaleY(0)",setTimeout(function(){document.querySelector(".start-contaner").style.display="none"},800)},200)},3e3)),function(){function e(e){o.match(/[^fr)][^ru)]/)?window.location.assign("/"):window.location.assign("/"+o)}function t(e){console.log(e.target)}for(var n=document.URL.split("/"),l=n[n.length-1],o=n[n.length-2],a=document.querySelectorAll(".menu li a"),i=document.querySelectorAll(".menu li"),r=a.length-1;r>=0;r--)a[r].href.split("/")[a[r].href.split("/").length-1]==l?i[r].classList.add("active"):l||i[0].classList.add("active");var c=document.querySelectorAll(".lang li");document.querySelector('img[alt="Dakar Taxi"]').addEventListener("click",e);for(r=c.length-1;r>=0;r--)c[r].addEventListener("click",t),c[r].children[0].href="/"+c[r].children[0].innerHTML+"/"+l,"eng"==c[r].children[0].innerHTML&&(c[r].children[0].href="/"+l),o.match(/[^fr)][^ru)]/)&&"eng"==c[r].children[0].innerHTML&&c[r].classList.add("active"),o==c[r].children[0].innerHTML&&c[r].classList.add("active")}();