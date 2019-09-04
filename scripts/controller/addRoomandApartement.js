(() => {

	//Global Variable Assigning
	var mPropertyId;
	var mPropertyDetails;
	var mRoomType;

	var uiRoomType = {
		"SingleBedRoom": "Single Bed Room",
		"DoubleBedRoom": "Double Bed Room",
		"OneBHKApartment": "One BHK Apartment",
		"TwoBHKApartment": "Two BHK Apartment",
		"ThreeBHKApartment": "Three BHK Apartment",
	};

	// Do followings, on page load.
	$(document).ready(() => {
		if (!Auth.isLoggedIn()) {
			//go to login
			Nav.gotoLogin();
			return;
		}
		// Get the propertyid Value
		mPropertyId = Utils.getURLParameter('building_id', window.location);
		// Fetch Room details
		fetchPropertyRoomDetails();

		// Go back to building images
		$('#Go_back_to_image').on('click', () => {
			// go to building images
			Nav.gotoAddBuildingImages(mPropertyId);
		});
		$(document).on('click', '#SignOut', function () {
			Auth.logout();
			//go to login
			Nav.gotoLogin();
		});
	});

	// Fetch property room details
	function fetchPropertyRoomDetails() {
		// Fetch Room Details
		Property.getProperty(mPropertyId).done((property) => {
			mPropertyDetails = property;
			var room = '';
			var roomid = mPropertyDetails.rooms.length;
			var display = mPropertyDetails.rooms;
			for (i = 0; i <= roomid - 1; i++) {

				var getimageslength = display[i].images.length;

				room += '<tr class="Delete_room">' +
				'<td>' + (i + 1) + '</td>' +
				'<td><button  class="btn btn-light buildingname roomtype" type="button" value="' + display[i].type + '">' + uiRoomType[display[i].type] + '</button></td>' +
				'<td><button  class="btn btn-light buildingname locationname" type="button" value="' + display[i].name + '">' + display[i].name + '</button></td>' +
				'<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].size + '">' + display[i].size + '</button></td>' +
				'<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].price + '">' + display[i].price + '</button></td>' +
				'<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].count + '">' + display[i].count + '</button></td>' +
				'<td><button  class="btn btn-light buildingname" value="' + display[i]._id + '" type="button"><i class="fa fa-pencil" aria-hidden="true"></i></button> <button  class="btn btn-light Delete_bul" value="' + display[i]._id + '" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button>' +
				'<button  class="btn btn-light buildingname" value="' + display[i]._id + '" type="button"><i class="fa fa-picture-o" aria-hidden="true"></i> (' + getimageslength + ')</button></td></tr>';

				// '</tr>';
			};
			$("#buildingtitle1 > tbody").html(room);

			// Handle save button click
			$('#save_room_image').on('click', createRoomImageCategoryDescription);

			// Handle Delete button
			$("#buildingtitle").on('click', '.Delete_bul', deleteRoomImagesCategoryDescription);

			// IMAGE UI CLOSE BUTTON CONTROL
			var closebtns = document.getElementsByClassName("close-thin");
			var i;
			for (i = 0; i < closebtns.length; i++) {
				closebtns[i].addEventListener("click", function () {
					this.parentElement.style.display = 'none';
				});
			}
			// IMAGE UPLOAD BUTTON CONTROL
			if (window.File && window.FileList && window.FileReader) {
				$("#file").on("change", function (e) {
					var files = e.target.files,
					filesLength = files.length;
					for (var i = 0; i < filesLength; i++) {
						var f = files[i]
							var fileReader = new FileReader();
						fileReader.onload = (function (e) {
							var file = e.target;
							$("<div class=\"pip\">" + "<span class=\"remove\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span>" +
								"<img class=\"imageThumbing\" id=\"yourImgId\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/>"
								 +
								"</div>").insertBefore("#dialog");
							$(".remove").click(function () {
								$(this).parent(".pip").remove();
								document.getElementById("file").value = "";
							});
						});
						fileReader.readAsDataURL(f);
					}
				});
			} else {
				alert("Your browser doesn't support to File API")
			}

			// Handle save button click
			$('#save_room').on('click', createRoom);

			// Handle update button click
			$('#Update_room').on('click', updateRoom);

			// Handle room deletion
			$("#buildingtitle1").on('click', '.Delete_bul', deleteRoom);

			// Handle Edit button
			$("#buildingtitle1").on('click', '.buildingname', handleEditButton);

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
			
			
			// Fetch available room types and show in drop-down
			var buildingType = mPropertyDetails.buildingtype;

			Meta.getRoomTypes(buildingType).done((rooms) => {

				mRoomType = rooms;

				var roomTypehtml = mRoomType.reduce((acc, cv) => {
						acc += '<option value="' + cv + '">' + uiRoomType[cv] + '</option>';
						return acc;
					}, '');
				$("#room_type").html(roomTypehtml);
			});

		});

	}

	// Function Save Room Images
	function createRoomImageCategoryDescription() {
		if (!RoomImageUiValidationPassed())
			return;

		var img_files = $('#file')[0].files;
		var Category = $("#Category_from").val();
		var Description = $("#Description_from").val();

		// Get roomId
		var roomimageID = Utils.getURLParameter('currentroom', window.location);

		// Image Validation
		for (var i = 0; i < img_files.length; i++) {

			var name = document.getElementById("file").files[i].name;
			var form_data = new FormData();
			var ext = name.split('.').pop().toLowerCase();
			if (jQuery.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
				alert("Invalid Image File");
				return false;
			}
			var oFReader = new FileReader();
			oFReader.readAsDataURL(document.getElementById("file").files[i]);
			var f = document.getElementById("file").files[0];
			var fsize = f.size || f.fileSize;
			if (fsize > 2000000) {
				alert("Image File Size is very big");
			} else {
				form_data.append("category", Category);
				form_data.append("description", Description);

				form_data.append("file", document.getElementById('file').files[i]);
				// console.log(form_data);
			}
		}

		Property.addRoomImage(mPropertyId, roomimageID, form_data)
		.done((property) => {
			// Success Handler
			console.log(JSON.stringify(property))
			var mPropertyId = property._id;
			// Refresh
			location.reload();

		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});

	}

	// Display the particular Room by clicking the Room name
	function handleEditButton() {
		var currentRow = $(this).closest("tr");
		var roomid = currentRow.find(".Delete_bul").val();
		var roomtype = currentRow.find(".roomtype").val();

		// Get Room Index value
		var getIndex = mPropertyDetails.rooms;

		var index = -1;
		var val = roomid;
		var filteredObj = getIndex.find(function (item, i) {
				if (item._id === val) {
					index = i;
					return i;
				}
			});
		var mGetRoomIndexValue = index;

		// FETCH ROOMS IMAGES, DESCRIPTION & CATEGORY
		var image = '';
		var imageid = mPropertyDetails.rooms[mGetRoomIndexValue].images;
		var imagelength = mPropertyDetails.rooms[mGetRoomIndexValue].images.length;
		var imageUrls = imageid.map(image => 'http://192.168.1.211:3000/facility/room' + image.url);

		var display = mPropertyDetails.rooms[mGetRoomIndexValue].images;

		for (i = 0; i <= imagelength - 1; i++) {
			image += '<tr class="Delete_LandMark">' +
			'<td>' + (i + 1) + '</td>' +
			'<td><img class="imageThumb" id="yourImgId" src=\"' + imageUrls[i] + '\" title="" + file.name + ""/></td>' +
			'<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].category + '">' + display[i].category + '</button></td>' +
			'<td><button  class="btn btn-light buildingname" type="button" value="' + display[i].description + '">' + display[i].description + '</button></td>' +
			'<td><button  class="btn btn-light Delete_bul" value="' + display[i]._id + '" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button></td>' +
			'</tr>';
		};
		$("#buildingtitle > tbody").html(image);
			//Fetch amenities for  particulr property
			Meta.getBuildingAmenities().done((amenities) => {
				var amenitieshtml = '';
	
				var amenitieslength = amenities.length;
	
				for (i = 0; i <= amenitieslength - 1; i++) {
	
					if (i % 4 === 5) {
						amenitieshtml += '<div  class="checkbox"><label><input type="checkbox" value="' + amenities[i] + '">' + amenities[i].replace(/([A-Z])/g, ' $1').trim() + '</label></div></br>';
					} else {
						amenitieshtml += '<div id="alignment" class="checkbox"><label><input type="checkbox" class="chk" value="' + amenities[i] + '">' + amenities[i].replace(/([A-Z])/g, ' $1').trim() + '</label></div>';
					}
	
				};
	
				$("#Put_checkbox").html(amenitieshtml);

		var edited = mPropertyDetails.rooms;
		for (var i in edited) {
			if ((roomid == edited[i]._id)) {
				$("#room_name").attr("value", edited[i].name);
				$("#room_size").attr("value", edited[i].size);
				$("#room_price").attr("value", edited[i].price);
				$("#room_count").attr("value", edited[i].count);

				var roomtypehtml;
				roomtypehtml = mRoomType.reduce((acc, cv) => {
						if (cv === edited[i].type) {
							acc += '<option selected value="' + cv + '">' + uiRoomType[cv] + '</option>';
						} else {
							acc += '<option value="' + cv + '">' + uiRoomType[cv] + '</option>';
						}
						return acc;
					}, '');
				$('#room_type').html(roomtypehtml);
			}
		}

		if (history.pushState) {
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?building_id=' + mPropertyId + "&currentroom=" + roomid;
			window.history.pushState({
				path: newurl
			}, '', newurl);
		}
		$("#Update_room").show();
		$("#displayimage").show();
		$("#addAmenity").show();
		$("#save_room").css('display', 'none');
      });
	}

	// Function Delete Room Images, Category & Description data to backend
	function deleteRoomImagesCategoryDescription() {
		// Get roomId
		var roomID = Utils.getURLParameter('currentroom', window.location);

		var currentRow = $(this).closest("tr");
		var col2 = currentRow.find("td:eq(3)").text();
		var col3 = currentRow.find("#yourImgId").attr('src');
		var roomimageID = $(this).val();

		var data = "Are you sure to delete this Image?";

		if (confirm(data)) {
			Property.deleteRoomImage(mPropertyId, roomID, roomimageID).done((property) => {
				$(".Delete_LandMark" + roomimageID).remove();

				// Refresh
				location.reload();
				// $("#ImageLoad").load(location.href + " #buildingtitle");
				// fetchPropertyRoomDetails();

			});
		}
	}

	// Function creates room data to backend
	function createRoom() {
		if (!uiValidationPassed())
			return;

		var fb = new Property.RoomBuilder();
		fb.setPropertyId(mPropertyId)
		.addName($("#room_name").val())
		.addType($("#room_type").val())
		.addSize($("#room_size").val())
		.addPrice($("#room_price").val())
		.addRoomCount($("#room_count").val())
		.create()
		.done((property) => {
			// Success Handler
			console.log(JSON.stringify(property))
			// Refresh
			location.reload();
		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});
	}

	// Function Updates room data to backend
	function updateRoom() {
		if (!uiValidationPassed())
			return;

		var roomid = Utils.getURLParameter('currentroom', window.location);

		var fb = new Property.RoomBuilder();
		fb.setPropertyId(mPropertyId)
		.setId(roomid)
		.addName($("#room_name").val())
		.addType($("#room_type").val())
		.addSize($("#room_size").val())
		.addPrice($("#room_price").val())
		.addRoomCount($("#room_count").val())
		.update()
		.done((property) => {
			// Success Handler
			console.log(JSON.stringify(property))
			// Refresh
			location.reload();
		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});
	}

	// Deletes a rooms
	function deleteRoom() {
		var currentRow = $(this).closest("tr");
		var col2 = currentRow.find("td:eq(2)").text();
		var roomId = $(this).val();
		var data = "Are you sure to delete this Room?" + "\n" + col2;
		if (confirm(data)) {

			Property.deleteRoom(mPropertyId, roomId).done(() => {
				// refresh
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
	var uiValidationPassed = () => {
		var roomname = $("#room_name").val();
		var roomsize = $("#room_size").val();
		var roomprice = $("#room_price").val();
		var roomcount = $("#room_count").val();

		if (!roomname) {
			$("#room_name_val").html("Room Name must be filled out");
		} else {
			$("#room_name_val").html("");
		}

		if (!roomsize) {
			$("#room_size_val").html("Room Size must be filled");
		} else if (!Utils.validateRoomSize(roomsize)) {
			$("#room_size_val").html("Room Size should be 3-4 digits");
		} else {
			$("#room_size_val").html("");
		}

		if (!roomprice) {
			$("#room_price_val").html("Room Price must be filled");
		} else if (!Utils.validatePrice(roomprice)) {
			$("#room_price_val").html("Numeric characters only");
		} else {
			$("#room_price_val").html("");
		}

		if (!roomcount) {
			$("#room_count_val").html("Room Count must be filled out");
		} else if (!Utils.validateCount(roomcount)) {
			$("#room_count_val").html("Room Count should be 1-2 digits");
		} else {
			$("#room_count_val").html("");
		}

		if (!roomname) {
			return false;
		}
		if (!roomsize) {
			return false;
		} else if (!Utils.validateRoomSize(roomsize)) {
			return false;
		}
		if (!roomprice) {
			return false;
		} else if (!Utils.validatePrice(roomprice)) {
			return false;
		}
		if (!roomcount) {
			return false;
		} else if (!Utils.validateCount(roomcount)) {
			return false;
		}

		return true;
	}

	// Validate all UI fields.
	// Should be invoked before creating a property.
	var RoomImageUiValidationPassed = () => {
		var img_files = $('#file')[0].files;
		var Category = $("#Category_from").val();
		var Description = $("#Description_from").val();

		if (img_files.length == 0) {
			$("#dialog2").html("Upload the Building Images");
		} else {
			$("#dialog2").html("");
		}

		if (!Category) {
			$("#Category").html("Category must be filled out");
		} else {
			$("#Category").html("");
		}

		if (!Description) {
			$("#Description").html("Description must be filled out");
		} else {
			$("#Description").html("");
		}

		if (img_files.length == 0) {
			return false;
		}

		if (!Category) {
			return false;
		}

		if (!Description) {
			return false;
		}

		return true;
	}

})();
