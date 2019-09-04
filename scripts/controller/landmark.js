(() => {
	var landmarkTypes = {
		'BusStand': 'Bus Stand',
		'RailwayStation': 'Railway Station',
		'MetroStation': 'Metro Station',
		'Airport': 'Airport',
		'Beach': 'Beach',
		'ShoppingMall': 'Shopping Mall',
		'Downtown': 'Downtown',
		'Pubs': 'Pubs',
		'Park': 'Park',
		'Temple': 'Temple',
		'Museum': 'Museum',
		'University': 'University',
		'Stadium': 'Stadium',
		'Hospital': 'Hospital'
	};
	var mPropertyId;
	var mPropertyDetails;
	var mAllLandmarkType;
	
	// Do followings, on page load.
	$(document).ready(() => {
        if(!Auth.isLoggedIn()) {
			//go to login
			Nav.gotoLogin();
            return;
		}
        
		//show ADD LANDMARK OR VIEW LANDMARK Button
		mPropertyId = Utils.getURLParameter('building_id', window.location);
		fetchPropertyDetailsAndShowLandmarks();
		populateLocationTypeDropDown();
		
		// Go back to Property Details
		$('#Go_back_to_building_GENERAL').on('click', () => {
			// go to View building Browse
			Nav.gotoViewProperty(mPropertyId);
		});
        $(document).on('click', '#SignOut', function () {
			Auth.logout();
			//go to login
			Nav.gotoLogin();
		});
	});
	
	// Fetch property details and show all landmarks
	function fetchPropertyDetailsAndShowLandmarks() {
		// Fetch Landmark Details
		Property.getProperty(mPropertyId).done((property) => {
			mPropertyDetails = property;
			var Landmarkhtml = '';
			var LandmarkLength = mPropertyDetails.nearby.length;
			var display = mPropertyDetails.nearby;

			for (i = 0; i <= LandmarkLength - 1; i++) {
				Landmarkhtml += '<tr class="Delete_LandMark">' +
				'<td>' + (i + 1) + '</td>' +
				'<td><button  class="btn btn-light buildingname locationtype" type="button" value="' + display[i].locationtype + '">' + landmarkTypes[display[i].locationtype] + '</button></td>' +
				'<td><button  class="btn btn-light buildingname locationname" type="button" value="' + display[i].name + '">' + display[i].name + '</button></td>';
				if (display[i].location) {
					Landmarkhtml += '<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].location.latitude + '">' + display[i].location.latitude + '</button></td>' +
					'<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].location.longitude + '">' + display[i].location.longitude + '</button></td>';
				} else {
					Landmarkhtml += '<td></td><td></td>';
				}
				Landmarkhtml += '<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].distanceinmeters + '">' + display[i].distanceinmeters + '</button></td>' +
				'<td><button  class="btn btn-light buildingname" value="' + display[i]._id + '" type="button"><i class="fa fa-pencil" aria-hidden="true"></i></button> <button  class="btn btn-light Delete_bul" value="' + display[i]._id + '" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button></td>' +
				'</tr>';

			};
			$("#buildingtitle > tbody").html(Landmarkhtml);
			
			// Handle save button click
			$('#save_landmark').on('click', createLandmark);
			
			// Handle update button click
			$('#Update_landMark').on('click', updateLandmark);
			
			// Handle landmark deletion
			$("#buildingtitle").on('click', '.Delete_bul', deleteLandmark);
			
			// Handle Edit button
			$("#buildingtitle").on('click', '.buildingname', handleEditLandmark);
			
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
			
			// Update buttons
			var amenitiesLength = mPropertyDetails.amenities.length;
			if (amenitiesLength == 0) {
				$(".ADD_AMENITIES").show();
			} else {
				$(".VIEW_AMENITIES").show();
			}
			$('.ADD_AMENITIES').on('click', () => {
				// go to Amenities
				Nav.gotoAmenities(mPropertyId);
			});
			$('.VIEW_AMENITIES').on('click', () => {
				// go to Amenities
				Nav.gotoAmenities(mPropertyId);
			});
		});
	}
	
	//Display the particular Landmark by clicking the landmark name
	function handleEditLandmark() {		
		var currentRow = $(this).closest("tr");
		var landmarkid = currentRow.find(".Delete_bul").val();
		
		var edited = mPropertyDetails.nearby;
		for (var i in edited) {
			if ((landmarkid == edited[i]._id)) {
				$("#landmark_name").attr("value", edited[i].name);
				$("#landmark_lat").attr("value", edited[i].location.latitude);
				$("#landmark_log").attr("value", edited[i].location.longitude);
				$("#Distance_from").attr("value", edited[i].distanceinmeters);
				
				var landmarktypehtml;
				
				landmarktypehtml = mAllLandmarkType.reduce((acc, cv) => {
							if (cv === edited[i].locationtype) {
								acc += '<option selected value="' + cv + '">' + cv.replace(/([A-Z])/g, ' $1').trim() + '</option>';
							} else {
								acc += '<option value="' + cv + '">' + cv.replace(/([A-Z])/g, ' $1').trim() + '</option>';
							}
							return acc;
						}, '');
				$('#landmark_type').html(landmarktypehtml); 
			}
		}

		if (history.pushState) {
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?building_id=' + mPropertyId + "&currentlandmark=" + landmarkid;
			window.history.pushState({
				path: newurl
			}, '', newurl);
		}
		$("#Update_landMark").show();
		$("#save_landmark").css('display', 'none');
	}
	
	// Fetch available location types and show in drop-down
	function populateLocationTypeDropDown() {
		Meta.getLocationTypes().done((Location) => {
			mAllLandmarkType = Location;
			var locationhtml = mAllLandmarkType.reduce((acc, cv) => {
					acc += '<option value="' + cv + '">' +
					//cv.replace(/([A-Z])/g, ' $1').trim()
					landmarkTypes[cv]
					 + '</option>';
					return acc;
				}, '');
			$('#landmark_type').html(locationhtml);
		});
	}
	
	// Function creates landmark data to backend
	function createLandmark() {
		if (!validateUI()) return;

		Property.addNearbyToProperty(mPropertyId,
			$("#landmark_name").val(),
			$("#landmark_type").val(),
			$("#Distance_from").val(),
			$("#landmark_lat").val(),
			$("#landmark_log").val())
		.done((property) => {
			// Success Handler
			mPropertyDetails = property;
			// fetchPropertyDetailsAndShowLandmarks();
				location.reload();
		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});
	}
	
	function updateLandmark() {
		if (!validateUI()) return;
		var nearbyid = Utils.getURLParameter('currentlandmark', window.location);

		Property.updateNearby(mPropertyId, nearbyid,
			$("#landmark_name").val(),
			$("#landmark_type").val(),
			$("#Distance_from").val(),
			$("#landmark_lat").val(),
			$("#landmark_log").val())
		.done((property) => {
			// Success Handler
			console.log(JSON.stringify(property))
			mPropertyDetails = property;
			// fetchPropertyDetailsAndShowLandmarks();
				location.reload();
		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});
	}
	
	// Deletes a landmark
	function deleteLandmark() {
		var currentRow = $(this).closest("tr");
		var col2 = currentRow.find("td:eq(2)").text();
		var nearbyid = $(this).val();

		var data = "Are you sure to delete this Landmark?" + "\n" + col2;

		if (confirm(data)) {
			Property.deleteNearby(mPropertyId, nearbyid).done((properties) => {
				// fetchPropertyDetailsAndShowLandmarks();
				location.reload();
			});
		}
	}
	
	// Function for goTop
	function goTop() {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

	}
	
	// Validate all UI fields.
	// Should be invoked before creating a property.
	function validateUI() {
		var landmarkname = $("#landmark_name").val();
		var latitude = $("#landmark_lat").val();
		var longitude = $("#landmark_log").val();
		var distance = $("#Distance_from").val();

		if (!landmarkname) {
			$("#land_Mark").html("Landmark Name must be filled out");
		} else {
			$("#land_Mark").html("");
		}
		
		if(latitude){
		if (!Utils.validateLatitude(latitude)) {
			$("#latitude-code").html("Latitude number should be xx.xxxxxxx");
		} else {
			$("#latitude-code").html("");
		}
		}

		if(longitude){
			
		if (!Utils.validateLongitude(longitude)) {
			$("#longitude-code").html("Longitude number should be xx.xxxxxxx");
		} else {
			$("#longitude-code").html("");
		}
		}

		if (!distance) {
			$("#distance_Metre").html("Distance must be filled out");
		} else if (!Utils.validateDistance(distance)) {
			$("#distance_Metre").html("Numeric characters only");
		} else {
			$("#distance_Metre").html("");
		}

		if (landmarkname == "") {
			return false;
		}

		// if (!Utils.validateLatitude(latitude)) {
			// return false;
		// }

		// if (!Utils.validateLongitude(longitude)) {
			// return false;
		// }

		if (distance == "") {
			return false;
		} else if (!Utils.validateDistance(distance)) {
			return false;
		}

		return true;
	}
})();
