var CityName = "Dakar";
var PerfName = $.guid++;
var url = "http://154.124.44.3:17005/MobileClientApiJson.svc";
var MonthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"];
var CityStreetObject = [];

var intervalID;
var phoneNumber = "";
var orderId = 0;
var currentBuilding = {};

function OtoCreateOrder() {
	$("#oto-btncreate").attr('disabled', 'disabled');
	var phone = $("#inputphone").val();
	var create = 1;

	if (create == 1) {
		$("#oto-cost").html("");

		var msk = 0;
		$('.maskoptionorders').each(function () {
			if (this.checked) {
				msk = msk + parseInt($(this).val());
			}
		});

		var orderRoutePoints = [];
		
		var streetId = ($("#inputstreetfrom").attr("alt") == "s") ? $("#inputstreetfrom").attr("rel") : null;
		var objectId = ($("#inputstreetfrom").attr("alt") == "o") ? $("#inputstreetfrom").attr("rel") : null;   
		
		orderRoutePoints.push({ StreetId: streetId, StreetName: $("#inputstreetfrom").val(), HouseId: $("#inputbuildfrom").attr("rel"), House: $("#inputbuildfrom").val(), ObjectId: objectId, Porch: $("#inputporchfrom").val() });
		
		$('.streetto').each(function (obj) {

			var streetIdt = ($(this).find('.inputstreetto').attr("alt") == "s") ? $(this).find('.inputstreetto').attr("rel") : null;
			var objectIdt = ($(this).find('.inputstreetto').attr("alt") == "o") ? $(this).find('.inputstreetto').attr("rel") : null;

			orderRoutePoints.push({ StreetId: streetIdt, StreetName: $(".inputstreetto").val(), HouseId: $(this).find(".inputbuildto").attr("rel"), House: $(this).find(".inputbuildto").val(), ObjectId: objectIdt, Porch: $(this).find(".inputporchto").val() });

		});

		if (create == 1) {
			
			$('.addrdel').each(function (obj) {
				$(this).remove();
			});
			
			phoneNumber = $("#inputphone").val();
			var order = {
				Id: 0,
				Latitude: 0,
				Longitude: 0,
				Area: '',
				GoodsNote: '',
				OrderRoutePoints: orderRoutePoints,
				CarCount: 0,
				ClientName: $("#username").val(),
				PhoneNumberLast: $("#inputphone1").val(),
				ExtraCost: $("#extracost").val(),
				City: CityName,
				CityTo: CityName,
				ClientId: PerfName,
				FormattedAddress: "String content",
				IsNoSpeak: false,
				IsIntercity: false,
				IsPreOrder: $("#oto-preorder").is(":checked"),
				DateSupply: $("#oto-preorder").is(":checked") ? ($("#dateto :selected").val() + " " + $("#hourto :selected").val() + ":" + $("#mituteto :selected").val()) : "",
				Note: $("#inputdescription").val(),
				OrderOptionMask: msk,
				PhoneNumber: $("#inputphone").val().replace(/[\+\-]/g, ""),
				TaxiType: $("#taxitypeselect :selected").val(),
				TypeOrder: 0,
				LoadSize: 0,
				Weight: 0,
				CarCount: $("#ColTaxi").val(),
				TariffId: $("#taxitariffselect :selected").val()
			};

			$.getJSON(url + "/CreateOrderWeb?callBack=?" + "&value=" + JSON.stringify(order), jsonpCreateOrder);
		}
	}
}


function jsonpCreateOrder(data) {
	if (data.ErrorCode == 0) {
		orderId = data.Context;
		$("#oto-btncreate").removeAttr('disabled');
		$(".icon-div").hide();
		$("#oto-btncancel").show();
		$("#oto-btnneworder").hide();
		$("input:text").attr('disabled', 'disabled');
		$("select").attr('disabled', 'disabled');
		$("#inputdescription").attr('disabled', 'disabled');
		$("#addAdrTo").attr('disabled', 'disabled');
		$("#getcost").attr('disabled', 'disabled');
		$("#oto-preorder").attr('disabled', 'disabled');
		$(".oto-div-params").hide();
		$(".oto-div-status").show();
		$(".panel-body").css("opacity", 0);
		intervalID = setInterval(OtoStatusOrder, 4000);
	} else {
		$(".panel-body").css("opacity", 1);
		$(".oto-div-error .panel-body").html("Erreur lors de l envoi, refaire svp.");
	}
}


function jsonpLoadStreet(street) {
	data = street;

	if (data.ErrorCode == 0) {
		for (var i = 0; i < data.Context.length; i++) {
			var o = { value: data.Context[i].Id, label: data.Context[i].Name, option: 's' };
			CityStreetObject.push(o);
		}
		
	} else {

	}
}


function jsonpLoadTariff(tariff) {
	data = tariff;
	$("#taxitariffselect").empty();
	
	if (data.ErrorCode == 0) {
		
		for (var i = 0; i < data.Context.length; i++) {

			var o = { value: data.Context[i].Id, label: data.Context[i].Name, option: 's' };
			$("#taxitariffselect").append("<option value='" +data.Context[i].Id+ "'>" +data.Context[i].Name+ "</option>");

		}
		if(data.Context.length==0)
		{
			$("#taxitariffselect").append("<option value='0'>Non</option>");
		}

	} else {
		$("#taxitariffselect").append("<option value='0'>Non</option>");
	}
}


function jsonpLoadObject(street) {
	data = street;

	if (data.ErrorCode == 0) {
		for (var i = 0; i < data.Context.length; i++) {
			var o = { value: data.Context[i].Id, label: data.Context[i].Name + "*", option: 'o' };
			CityStreetObject.push(o);
		}

	} else {

	}
}


function jsonpStatusOrder(data) {
	if (data.ErrorCode == 0) {
		var status = "";
		switch (data.Context.Status) {
			case 1:
			status = "Nouvelle commande"; break;
			case 2:
			status = "En route vers le client"; break;
			case 3:
			status = "En attente du client"; break;
			case 4:
			status = "Client averti"; break;
			case 5:
			status = "En route"; break;
			case 6:
			status = "Realise"; break;
			case 7:
			status = "Annule"; break;
			case 8:
			status = "En retard"; break;

			default: status = "non defini";
		}
		$(".statustext").text(status);
		$(".drivertext").text(data.Context.PerformerName);
		$(".taxitext").text(data.Context.TaxisModel + "  " + data.Context.TaxisNumber);
		$(".timetext").text(data.Context.DateComing);
		
		if (data.Context.Price == '0,00') {
			$(".costtext").text("  " + "par tarif");
		} else {
			$(".costtext").text("  "+data.Context.Price+" Cfa");
		}

		if (data.Context.Status == 6) {
			clearInterval(intervalID);
			$("#oto-btncancel").hide();
			$("#oto-btnneworder").hide();
			$("#oto-btnnew").show();
			$(".oto-div-status").hide();
			$(".oto-div-execute").show();
		}

		if (data.Context.Status == 7) {
			clearInterval(intervalID);
			$("#oto-btncancel").hide();
			$("#oto-btnneworder").hide();
			$("#oto-btnnew").show();
		}
	} else {

	}
}


function jsonpGetCost(data) {
    if (data.ErrorCode == 0) {
		if (data.Context == '0,00') {
			$("#oto-cost").html(" Prix approximatif du trajet: " + "par tarif");
		} else {
			$("#oto-cost").html(" Prix approximatif du trajet: " + data.Context + " Cfa");
		}
    } else {
        $("#oto-cost").html(data.Context);
    }
}


function jsonpCancelOrder(data) {
	if (data.ErrorCode == 0) {

		clearInterval(intervalID);

		var status = "";
		switch (data.Context.Status) {
			case 1:
			status = "Nouvelle commande"; break;
			case 2:
			status = "En route vers le client"; break;
			case 3:
			status = "En attente du client"; break;
			case 4:
			status = "Client averti"; break;
			case 5:
			status = "En route"; break;
			case 6:
			status = "Realise"; break;
			case 7:
			status = "Annule"; break;
			case 8:
			status = "En retard"; break;

			default: status = "non defini";
		}
		$(".statustext").text(status);
		$(".drivertext").text(data.Context.PerformerName);
		$(".taxitext").text(data.Context.TaxisModel + "  " + data.Context.TaxisNumber);
		$(".timetext").text(data.Context.DateComing);
		$(".costtext").text(" de "+data.Context.Price);
		orderId = 0;
		$("#oto-btncreate").show();
		$("#oto-btncancel").hide();
		$("#oto-btnneworder").hide();
		$("input:text").removeAttr('disabled');
		$("input:text").val("");
		$("select").removeAttr('disabled');
		$("#inputdescription").val("");
		$("#ColTaxi").val("1");
		$("#oto-cost").html("");
		$("#extracost").val("0");
		$("input:checkbox").removeAttr("checked");
		$("#inputdescription").removeAttr('disabled');
		$("#oto-preorder").removeAttr('disabled');
		$(".oto-div-params").show();
		$(".oto-div-status").hide();
		$(".oto-div-execute").hide();
		$("#addAdrTo").removeAttr('disabled');
		$("#getcost").removeAttr('disabled');

		$(".statustext").html("");
		$(".taxitext").html("");
		$(".timetext").html("");
		$(".costtext").html("");
		
		$(".oto-div-predate").hide();
		$("#oto-preorder").removeAttr("checked");
		$("#taxitypeselect").val("63");

		$('.addstreet').each(function (obj) {
			$(this).remove();
		});
		
	} else {

	}
}


function OtoNewOrder() {
	
	document.location.reload();

	$("#oto-btncreate").show();
	$("#oto-btncancel").hide();
	$("#oto-btnnew").hide();
	$("input:text").removeAttr('disabled');
	$("input:text").val("");
	$("input:checkbox").removeAttr("checked");
	$("select").removeAttr('disabled');
	$("#inputdescription").val("");
	$("#inputdescription").removeAttr('disabled');
	$("#ColTaxi").val("1");
	$("#extracost").val("0");
	$("#oto-cost").html("");
	$("#oto-preorder").removeAttr('disabled');
	$(".oto-div-params").show();
	$(".oto-div-status").hide();
	$(".oto-div-execute").hide();
	$("#addAdrTo").removeAttr('disabled');
	$("#getcost").removeAttr('disabled');
	$("#oto-btncreate").removeAttr('disabled');           

	$(".statustext").html("");
	$(".taxitext").html("");
	$(".timetext").html("");
	$(".costtext").html("");
	
	$(".oto-div-predate").hide();
	$("#oto-preorder").removeAttr("checked");
	$("#taxitypeselect").val("63");

	$('.addstreet').each(function (obj) {
		$(this).remove();
	});
	
}


function OtoStatusOrder() {
	var obj = { PhoneNumber: phoneNumber, ClientId: "123", OrderId: orderId };
	$.getJSON(url + "/GetStatusOrderWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpStatusOrder);
}


function OtoCancelOrder() {
	var obj = { PhoneNumber: phoneNumber, ClientId: "123", OrderId: orderId };
	$.getJSON(url + "/CancelOrderWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpCancelOrder);
	
	document.location.reload();         
}


function LoadStreet() {
	var obj = { OnlyHash: false };
	$.getJSON(url + "/GetStreetCityWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpLoadStreet);
}


function LoadTariff() {
	var obj = { OnlyHash: false };
	$.getJSON(url + "/GetTariffsWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpLoadTariff);
}


function LoadObject() {
	var obj = { OnlyHash: false };
	$.getJSON(url + "/GetObjectCityWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpLoadObject);
}


function GetCost() {
	var phone = $("#inputphone").val();
	var create = 1;

	if ($("#inputstreetfrom").val() == "") {
		create = 0;
	}

	if ($("#inputstreetfrom").attr("alt") == "s") {

		if ($("#inputstreetfrom").val() != "" && $("#inputbuildfrom").val() == "") {
			create = 0;
		}
	}

	if (create == 1) {

		var msk = 0;
		$('.maskoptionorders').each(function () {
			if (this.checked) {
				msk = msk + parseInt($(this).val());
			}
		});

		var orderRoutePoints = [];
		var streetId = ($("#inputstreetfrom").attr("alt") == "s") ? $("#inputstreetfrom").attr("rel") : null;
		var objectId = ($("#inputstreetfrom").attr("alt") == "o") ? $("#inputstreetfrom").attr("rel") : null;

		orderRoutePoints.push({ StreetId: streetId, HouseId: null, House: $("#inputbuildfrom").val(), ObjectId: objectId, Porch: $("#inputporchfrom").val() });

		$('.streetto').each(function (obj) {
			if ($(this).find('.inputstreetto').val() != "") {
				var streetIdt = ($(this).find('.inputstreetto').attr("alt") == "s") ? $(this).find('.inputstreetto').attr("rel") : null;
				var objectIdt = ($(this).find('.inputstreetto').attr("alt") == "o") ? $(this).find('.inputstreetto').attr("rel") : null;

				orderRoutePoints.push({ StreetId: streetIdt, HouseId: null, House: $(this).find(".inputbuildto").val(), ObjectId: objectIdt, Porch: $(this).find(".inputporchto").val() });
			}
		});

		phoneNumber = $("#inputphone").val();
		var order = {
			OrderRoutePoints: orderRoutePoints,
			ClientId: PerfName,
			OrderOptions: msk,
			PhoneNumber: $("#inputphone").val().replace(/[\+\-]/g, ""),
			TariffId: $("#taxitariffselect :selected").val()    
		};
		$.getJSON(url + "/GetPerfPriceWeb?callBack=?" + "&value=" + JSON.stringify(order), jsonpGetCost);
	}
}


function changePreorder() {
	if ($("#oto-preorder").is(':checked')) {
		var d = new Date();
		d = d.getHours() + 1;
		$("#hourto [id='" + d + "']").attr("selected", "selected");
		$(".oto-div-predate").show();
	} else {
		$(".oto-div-predate").hide();
	}
}


function delpoint(e) {
	$(e).parent().parent().remove();
	$("#oto-cost").html("");
}


function addAddressTo() {
	if ($(".streetto").length < 3) {
		$("#oto-cost").html("");
		$("#streetarray").append('<div class="streetto addstreet"><div class="oto-div-streetto"><span class="strtolable">Rue</span><input class="inputstreetto autostreet"/> <b class="addrdel" style="color: red; cursor:pointer;" onclick="delpoint(this);">X</b></div><div class="oto-div-buildto div-build"><span class="buildtolable">Maison</span><input class="inputbuildto" /></div><div class="oto-div-porchto"><span class="porchtolable">Entree</span><input class="inputporchto" /></div></div>');
		$(".autostreet").autocomplete({
			minLength: 3,
			source: CityStreetObject,
			_renderItem: function (ul, item) {
				return $("<li>")
				.attr("data-value", item.value)
				.append($("<a>").text(item.label))
				.appendTo(ul);
			},
			focus: function (event, ui) {
				event.preventDefault();
				$(this).attr("rel", ui.item.value);
				$(this).attr("alt", ui.item.option);
				$(this).val(ui.item.label);

			},
			select: function (event, ui) {
				event.preventDefault();
				$(this).attr("rel", ui.item.value);
				$(this).attr("alt", ui.item.option);
				$(this).val(ui.item.label);
				if (ui.item.option == "o") {
					$(this).parent().parent().find(".div-build input").attr("disabled", "disabled");
					$(this).parent().parent().find(".div-build input").val('');
				} else {
					$(this).parent().parent().find(".div-build input").val('');
					$(this).parent().parent().find(".div-build input").removeAttr("disabled");
					SetBuildInput($(this).parent().parent().find(".div-build input"), ui.item.value);
				}
			}
		});
} else {
	$(".panel-body").css("opacity", 1);
	$(".oto-div-error .panel-body").html("Surplus sur le nombre du trajet!");
}      
}


function jsonpLoadBuild(data) {

	if (data.ErrorCode == 0) {

		var array = [];
		for (var i = 0; i < data.Context.length; i++) {

			var o = { value: data.Context[i].Id, label: data.Context[i].Name };
			array.push(o);

		}
		$(currentBuilding).autocomplete({
			minLength: 0,
			source: array,
			_renderItem: function (ul, item) {
				return $("<li>")
				.attr("data-value", item.value)
				.append($("<a>").text(item.label))
				.appendTo(ul);
			},
			focus: function (event, ui) {
				event.preventDefault();
				$(this).attr("rel", ui.item.value);
				$(this).attr("alt", ui.item.option);
				$(this).val(ui.item.label);
			},
			select: function (event, ui) {
				event.preventDefault();
				$(this).attr("rel", ui.item.value);
				$(this).attr("alt", ui.item.option);
				$(this).val(ui.item.label);
			}

		});
		$(currentBuilding).autocomplete("search", "");
		$(currentBuilding).focus();
	}
}


function SetBuildInput(obj, id) {
	currentBuilding = obj;
	var obj = { StreetId: id };
	$.getJSON(url + "/GetBuildingsForCurrentStreetWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpLoadBuild);
}


function jsonpCheckClient(data) {

	if (data.ErrorCode == 0) {
		if (data.Context.IsAuth) {
			
			OtoCreateOrder();
			$(".panel-body").css("opacity", 1);
			$(".oto-div-error .panel-body").html("");
			$(".oto-div-sms").hide();
			
		} else {
			$(".oto-div-sms").show();
			$(".panel-body").css("opacity", 1);
			$(".oto-div-error .panel-body").html("SMS envoye sur votre telephone avec code de denarrage!");
			
			$("#oto-btncreate").attr("disabled", "disabled");
		}
	} else {
		$(".panel-body").css("opacity", 1);
		$(".oto-div-error .panel-body").html(data.ErrorMessage);
	}
	
}


function CheckClient() {

	var phone = $("#inputphone").val().replace(/\-/g, "");
	var create = 1;

	if (phone.search(/^\+[0-9]{12}$/) == -1) {
		$(".panel-body").css("opacity", 1);
		$(".oto-div-error .panel-body").html("Inserer le numero correct!");
		create = 0;
	} else 

	if  ($("#username").val() == "") {
		$(".oto-div-error .panel-body").html("Entrez le nom!");
		$(".panel-body").css("opacity", 1);
		create = 0;
	} else

	if ($("#inputstreetfrom").val() == "") {
		$(".panel-body").css("opacity", 1);
		$(".oto-div-error .panel-body").html("Definissez ladresse d envoi!");
		create = 0;
	} else

	if ($("#inputstreetfrom").attr("alt") != "o") {

		if ($("#inputstreetfrom").val() != "" && $("#inputbuildfrom").val() == "") {
			$(".panel-body").css("opacity", 1);
			$(".oto-div-error .panel-body").html("Definissez l adresse de la maison!");
			create = 0;
		}
	} else
	
	$('.streetto').each(function (obj) {
		var s = $(this).find('.inputstreetto').val();
		if (s != "") {
			var goes = 0;
			for (var i = 0; i < CityStreetObject.length; i++) {
				if (s == CityStreetObject[i].label) {
					goes = 1;
				}
			}
			if (goes == 0) {
				$(".panel-body").css("opacity", 1);
				$(".oto-div-error .panel-body").html("Definer le trajet!");
				create = 0;
			}
		}
	});             
	
	if (create == 1) {
		
		var obj = { PhoneNumber: $("#inputphone").val().replace(/[\+\-]/g, ""), ClientId: PerfName };
		$.getJSON(url + "/CheckClientWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpCheckClient);
	}

}


function jsonpCheckClientCode(data) {

	if (data.ErrorCode == 0) {
		$(".panel-body").hide();
		$(".oto-div-error .panel-body").html("");
		$("#oto-btncreate").removeAttr("disabled");
		$(".oto-div-sms").hide();
		OtoCreateOrder();
	} else {
		$(".panel-body").css("opacity", 1);
		$(".oto-div-error .panel-body").html("Il vous reste " + data.Context + " essais! " + data.ErrorMessage);
	}

}


function CheckClientCode() {
	if ($("#smsCode").val() != "") {
		var obj = { PhoneNumber: $("#inputphone").val().replace(/[\+\-]/g, ""), ClientId: PerfName, SmsCode: $("#smsCode").val() };
		$.getJSON(url + "/CheckClientCodeWeb?callBack=?" + "&value=" + JSON.stringify(obj), jsonpCheckClientCode);
		
	} else {
		$(".panel-body").css("opacity", 1);
		$(".oto-div-error  .panel-body").html("Entrer le code SMS!");
	}
	
}


$(function () {
	
	LoadStreet();
	LoadObject();
	LoadTariff();
	$("#oto-btncreate").click(CheckClient);
	$("#oto-btnsms").click(CheckClientCode);
	$("#oto-btncancel").click(OtoCancelOrder);
	$("#oto-btnnew").click(OtoNewOrder);
	$("#inputtime").mask("99:99");
	$("#inputphone").mask("+221-000-000-000");
	$("#inputphone1").mask("+221-000-000-000");          
			
			for (var i = 0; i < 24; i++) {

				$("#hourto").append($('<option>', {
					id: String(i).length == 1 ? '' + i : i,
					value: String(i).length == 1 ? '0' + i : i,
					text: String(i).length == 1 ? '0' + i : i                   
				}));

			}

			for (var i = 0; i < 6; i++) {

				$("#mituteto").append($('<option>', {
					value: String(i * 10).length == 1 ? '0' + i : i * 10,
					text: String(i * 10).length == 1 ? '0' + i : i * 10
				}));

			}
			
			var today = new Date();
			var tomorrow = new Date();
			tomorrow.setDate(today.getDate() + 1);

			$("#dateto").append($('<option>', {
				value: today.getFullYear() + "-" + (String(today.getMonth()+1).length == 1 ? '0' + (today.getMonth()+1) : (today.getMonth()+1)) + "-" + (String(today.getDate()).length == 1 ? '0' + today.getDate() : today.getDate()),
				text: (String(today.getDate()).length == 1 ? '0' + today.getDate() : today.getDate()) + "-" + MonthNames[today.getMonth()] + "-" + today.getFullYear()
			}));

			$("#dateto").append($('<option>', {
				value: tomorrow.getFullYear() + "-" + (String(tomorrow.getMonth()+1).length == 1 ? '0' + (tomorrow.getMonth()+1) : (tomorrow.getMonth()+1)) + "-" + (String(tomorrow.getDate()).length == 1 ? '0' + tomorrow.getDate() : tomorrow.getDate()),
				text: (String(tomorrow.getDate()).length == 1 ? '0' + tomorrow.getDate() : tomorrow.getDate()) + "-" + MonthNames[tomorrow.getMonth()] + "-" + tomorrow.getFullYear()
			}));

			$(".autostreet").autocomplete({
				minLength: 3,
				source: CityStreetObject,
				_renderItem: function (ul, item) {
					return $("<li>")
					.attr("data-value", item.value)
					.append($("<a>").text(item.label))
					.appendTo(ul);
				},
				focus: function (event, ui) {
					event.preventDefault();
					$(this).attr("rel", ui.item.value);
					$(this).attr("alt", ui.item.option);
					$(this).val(ui.item.label);
				},
				select: function (event, ui) {
					event.preventDefault();
					$(this).attr("rel", ui.item.value);
					$(this).attr("alt", ui.item.option);
					$(this).val(ui.item.label);
					if (ui.item.option == "o") {
						$(this).parent().parent().find(".div-build input").attr("disabled", "disabled");
						$(this).parent().parent().find(".div-build input").val('');
					} else {
						$(this).parent().parent().find(".div-build input").val('');
						$(this).parent().parent().find(".div-build input").removeAttr("disabled");
						SetBuildInput($(this).parent().parent().find(".div-build input"), ui.item.value);
					}

				}
			});

});


function createneworder() {
	if (confirm("Au cours de la nouvelle commande, l information sur son statut et son annulation reste inacessible. Vous confirmez la nouvelle commande?")) {
		return document.location.reload();
	} else {
		return false;
	}
}