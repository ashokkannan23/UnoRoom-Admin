(() => {

	//Global Variable Assigning
	var mPropertyDetails;

	$(document).ready(() => {
  if(!Auth.isLoggedIn()) {
			//go to login
			Nav.gotoLogin();
            return;
		}
        
		//Declaring main function
		fetchAllTheProperties();
        
    $(document).on('click', '#SignOut', function () {
			Auth.logout();
			//go to login
			Nav.gotoLogin();
		});
	});
	// Fetch all properties
	function fetchAllTheProperties() {

		Property.listProperties().done((properties) => {
			mPropertyDetails = properties;
			var propertyItem = '';
			var building = mPropertyDetails.length;

			var statusType = {
				"active": "Publish",
				"inactive": "Delist",
			};
			for (i = 0; i <= building - 1; i++) {
				propertyItem += '<tr class="delete_building">' +
				'<td>' + mPropertyDetails[i].facilityid + '</td>' +

				'<td><button  class="btn btn-light buildingname _id" type="button" value="' + mPropertyDetails[i]._id + '">' + mPropertyDetails[i].name + '</button></td>' +

				'<td><button   class="btn btn-light buildingname City" type="button" value="' + mPropertyDetails[i].address.city + '">' + mPropertyDetails[i].address.city + '</button></td>' +

				'<td><button   class="btn btn-light buildingname Locality" type="button" value="' + mPropertyDetails[i].address.locality + '">' + mPropertyDetails[i].address.locality + '</button></td>' +

				'<td><button  class="btn btn-light buildingname State" value="' + mPropertyDetails[i].address.state + '" type="button">' + statusType[mPropertyDetails[i].status] + '</button></td>' +

				'<td><button  class="btn btn-light buildingname Buildingtype" value="' + mPropertyDetails[i].buildingtype + '" type="button">' + mPropertyDetails[i].buildingtype.replace(/([A-Z])/g, ' $1').trim() + '</button></td>' +

				'<td><button  class="btn btn-light buildingname EditBuilding" value="' + mPropertyDetails[i].status + '" type="button"><i class="fa fa-pencil" aria-hidden="true"></i></button>';

				var buttonClassName = (mPropertyDetails[i].status == 'active') ? 'DelistProperty' : 'PublishProperty';
				var imgClassName = (mPropertyDetails[i].status == 'active') ? 'fa-eye' : 'fa-eye-slash';

				propertyItem += '<button class="btn btn-light ' + buttonClassName + '" value="' + mPropertyDetails[i]._id + '" type="button"><i class="fa ' + imgClassName + '" aria-hidden="tru +e"></i></button></td></tr>';

				$("#buildingtitle > tbody").html(propertyItem);

			}

			// Handle Publish button
			$(document).on('click', '.PublishProperty', makePublish);

			// Handle Delist button
			$(document).on('click', '.DelistProperty', makeDelist);
			
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
			
			

			// Handle Edit button
			$("#buildingtitle").on('click', '.buildingname', editProperty);

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

		});

	}

	// Function for PublishProperty in backend
	function makePublish() {

		var propertyid = $(this).val();

		//Check the clicked property is contain rooms or not
		Property.getProperty(propertyid).done((property) => {
			var roomLength = property.rooms.length;
			if (roomLength == 0) {
				alert('Please Add Atlest One Room (Or) Apartment');
			} else {
				Property.publishProperty(propertyid).done(() => {
					// Refresh
					location.reload();

				});

			}

		});
	}

	// Function for DelistProperty in backend
	function makeDelist() {

		var propertyid = $(this).val();
		Property.delistProperty(propertyid).done(() => {

			// go to Browse property (same page)
			Nav.gotoBrowseProperty();

		});

	}

	// Function Search By Property Name
	function searchProperty() {

		var input,
		filter,
		table,
		tr,
		td,
		i,
		txtValue;
		input = document.getElementById("search-field");
		filter = input.value.toUpperCase();

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

	// Function for Edit button
	function editProperty() {
		var currentRow = $(this).closest("tr");
		var propertyid = currentRow.find("._id").val();
		// go to View building Browse
		Nav.gotoViewProperty(propertyid);

	}

	// Function for goTop
	function goTop() {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

	}

})();
