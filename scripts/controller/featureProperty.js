(() => {
	// List of all featured properties
	var allFeaturedProperties;
	
	$(document).ready(() => {
    if(!Auth.isLoggedIn()) {
		  	//go to login
			  Nav.gotoLogin();
            return;
		}
 
    // Search by "pressing enter Button"
		// document.getElementById('search-field').addEventListener('keypress', function (event) {
			// if (event.keyCode == 13) {
				// event.preventDefault();
				// $("#searchProperty").click();
			// }
		// });
		
		// Search by "pressing enter Button Don't Refresh Page"
				document.getElementById('search-field').addEventListener('keypress', function (event) {
					if (event.keyCode == 13) {
						event.preventDefault();
						searchProperty();
					}
				});

				// Search by "Clicking Don't Refresh Page"
				$('#searchUser').on('click', function (event) {
					event.preventDefault();
					searchProperty();
				});
           
		// Populate the UI with featured 
		// and non-featured property
		populateUI();
		
		// Search By Property Name
		function searchProperty(){
			var input,
			filter,
			table,
			tr,
			td,
			i,
			txtValue;
			input = document.getElementById("search-field");
			filter = input.value.toUpperCase();
			console.log(filter);

			table = document.getElementById("buildingtitle");
			tr = table.getElementsByTagName("tr");
			
			for (i = 1; i < tr.length; i++) {

			var propertyName,
			city,
			locality;
			var nameCol = tr[i].getElementsByTagName("td")[1];
			if (nameCol)
				propertyName = nameCol.textContent || nameCol.innerText;

			var cityCol = tr[i].getElementsByTagName("td")[2];
			if (cityCol)
				city = cityCol.textContent || cityCol.innerText;

			var localityCol = tr[i].getElementsByTagName("td")[3];
			if (localityCol)
				locality = localityCol.textContent || localityCol.innerText;

			if ((propertyName && propertyName.toUpperCase().indexOf(filter) > -1) ||
				(city && city.toUpperCase().indexOf(filter) > -1) ||
				(locality && locality.toUpperCase().indexOf(filter) > -1)) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
		}

    $(document).on('click', '#SignOut', function () {
			Auth.logout();
			//go to login
			Nav.gotoLogin();
		});
	}); // document.ready()

	function populateUI() {
		// Show all Featured Property
		// Fetch all featured properties and update UI
		UI.getFeaturedProperty().done(propertyList => {

			allFeaturedProperties = propertyList;
			showFeaturedPropertyList(propertyList);

			// Show all non-Featured property-list
			// Fetch all property, Remove all featured Property, Update UI
			Property.listProperties().done(showNonFeaturedPropertyList);
		});
	}

	// This function shows non-featured properties
	function showNonFeaturedPropertyList(allProperties) {
		var properties = removeFeaturedProperty(allProperties);
		var propertyhtml = '';
		var building = properties.length;

		var statusType = {
			"active": "Publish",
			"inactive": "Delist",
		};

		for (i = 0; i <= building - 1; i++) {

			propertyhtml += '<tr class="delete_building">' +
			'<td>' + properties[i].facilityid + '</td>' +
			'<td><button  class="btn btn-light buildingname _id" type="button" value="' + properties[i]._id + '">' + properties[i].name + '</button></td>' +
			'<td><button   class="btn btn-light buildingname City" type="button" value="' + properties[i].address.city + '">' + properties[i].address.city + '</button></td>' +
			'<td><button   class="btn btn-light buildingname Locality" type="button" value="' + properties[i].address.locality + '">' + properties[i].address.locality + '</button></td>' +
			'<td><button  class="btn btn-light buildingname State" value="' + properties[i].address.state + '" type="button">' + statusType[properties[i].status] + '</button></td>' +
			'<td><button  class="btn btn-light buildingname Buildingtype" value="' + properties[i].buildingtype + '" type="button">' + properties[i].buildingtype.replace(/([A-Z])/g, ' $1').trim() + '</button></td>' +
			'<td><button  class="btn btn-light all_PropertiesID" value="' + properties[i]._id + '" type="button"><i class="fa fa-plus-circle fa-2x" aria-hidden="true"></i></button></td>' +
			'</tr>';

		};

		$("#buildingtitle > tbody").html(propertyhtml);
		// var tr = $(propertyhtml).closest('tr');

		// if ((tr.length >= 5)) {
			// $("#space").addClass("give_space1");
			// $("#space").removeClass("give_space");
		// }

		// if ((tr.length >= 6)) {
			// $("#space").removeClass("give_space");
		// }

		$("#buildingtitle").on('click', '.all_PropertiesID', function () {

			var currentRow = $(this).closest("tr");

			var col2 = currentRow.find("td:eq(1)").text();
			var propertyid = $(this).val();
			var tata = "Add to Feature Property?" + "\n" + col2;

			if (confirm(tata)) {
				UI.addToFeatureProperty(propertyid).done(() => {
					// Refresh UI
					// populateUI();
					location.reload();
				});

			}

		});
	}

	// This function removes featured property from all property list
	function removeFeaturedProperty(allProperties) {
		function doesPropertyExist(propertyId) {
			var item = allFeaturedProperties.find(property => property.facilityid == propertyId);
			console.log(propertyId + '  ' + (item === undefined));
			return (item === undefined);
		}
		
		return allProperties.filter(prop => doesPropertyExist(prop.facilityid));
	}

	// This function shows featured property-list in UI
	function showFeaturedPropertyList(peroprtyList) {
		var featurehtml = '';
		var feature_building = peroprtyList.length;
		// console.log(feature_building);
		var StatusType = {
			"active": "Publish",
			"inactive": "Delist",
		};
		var PropertyType = {
			"Hotel": "Hotel",
			"ServiceApartment": "Service Apartment",
		};

		for (i = 0; i <= feature_building - 1; i++) {

			featurehtml += '<tr class="del_featurebuilding">' +
			'<td>' + peroprtyList[i].facilityid + '</td>' +
			'<td><button  class="btn btn-light buildingname _id" type="button" value="' + peroprtyList[i]._id + '">' + peroprtyList[i].name + '</button></td>' +
			'<td><button   class="btn btn-light buildingname City" type="button" value="' + peroprtyList[i].address.city + '">' + peroprtyList[i].address.city + '</button></td>' +
			'<td><button   class="btn btn-light buildingname Locality" type="button" value="' + peroprtyList[i].address.locality + '">' + peroprtyList[i].address.locality + '</button></td>' +
			'<td><button  class="btn btn-light buildingname State" value="' + peroprtyList[i].address.state + '" type="button">' + StatusType[peroprtyList[i].status] + '</button></td>' +
			'<td><button  class="btn btn-light buildingname Buildingtype" value="' + peroprtyList[i].buildingtype + '" type="button">' + PropertyType[peroprtyList[i].buildingtype] + '</button></td>' +
			'<td><button  id="BuildingProperty" class="btn btn-light Delete_featurebuilding" value="' + peroprtyList[i]._id + '" type="button"><i class="fa fa-times-circle fa-2x" aria-hidden="true"></i></button></td>' +
			'</tr>';

		};

		$("#featurebuilding > tbody").html(featurehtml);
		
		// Handle click event on delete button
		$("#featurebuilding").on('click', '.Delete_featurebuilding', function () {

			var currentRow = $(this).closest("tr");

			var col2 = currentRow.find("td:eq(1)").text();
			var propertyid = $(this).val();
			var data = "Remove Feature Property?" + "\n" + col2;

			if (confirm(data)) {
				UI.deletefeaturedProperty(propertyid).done(() => {
					// Refresh UI
					// populateUI();
					location.reload();
				});
			}
		});
		
		// Handle Top button
				$("#myBtn").on('click', goTop);

				// Onscrool button shows
				window.onscroll = function () {
					scrollFunction()
				};

				function scrollFunction() {
					if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
						document.getElementById("myBtn").style.display = "block";
					} else {
						document.getElementById("myBtn").style.display = "none";
					}
				}
		
	}
	
	// Function for goTop
	function goTop() {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

	}
	
})();
