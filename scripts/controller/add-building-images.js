(() => {

	//Global Variable Assigning
	var mPropertyId;
	var mPropertyDetails;

	$(document).ready(() => {
        if(!Auth.isLoggedIn()) {
			//go to login
			Nav.gotoLogin();
            return;
		}
		// Get the propertyid Value
		mPropertyId = Utils.getURLParameter('building_id', window.location);
		// Declaring main function
		fetchPropertyImagesCategoryDescription();

		// Go back to building amenities
		$('#Go_back_to_building_amenities').on('click', () => {
			Nav.gotoAmenities(mPropertyId);
		});
        $(document).on('click', '#SignOut', function () {
			Auth.logout();
			//go to login
			Nav.gotoLogin();
		});
	});

	// Main Function to fetch all the elements
	function fetchPropertyImagesCategoryDescription() {

		// FETCH IMAGES, DESCRIPTION & CATEGORY
		Property.getProperty(mPropertyId).done((property) => {
			mPropertyDetails = property;
			var image = '';
			var imageid = mPropertyDetails.images;
			var imagelength = mPropertyDetails.images.length;
			var imageUrls = imageid.map(image => 'http://192.168.1.211:3000/facility' + image.url);

			var display = mPropertyDetails.images;

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

			// Handle save button click
			$('#save_image').on('click', createImageCategoryDescription);

			// Handle Delete button
			$("#buildingtitle").on('click', '.Delete_bul', deleteImagesCategoryDescription);
			
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

			//show ADD ROOMS OR VIEW ROOMS Button
			var imagesLength = mPropertyDetails.rooms.length;
			if (imagesLength == 0) {
				$(".ADD_ROOM").show();
			} else {
				$(".VIEW_ROOM").show();
			}
			$('.ADD_ROOM').on('click', () => {
				// go to Add Rooms / Apartment
				Nav.gotoAddRooms(mPropertyId);
			});
			$('.VIEW_ROOM').on('click', () => {
				// go to Add Rooms / Apartment
				Nav.gotoAddRooms(mPropertyId);
			});

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
		});
	}

	// Function create Images, Category & Description data to backend
	function createImageCategoryDescription() {
		if (!uiValidationPassed())
			return;

		var img_files = $('#file')[0].files;
		var Category = $("#Category_from").val();
		var Description = $("#Description_from").val();

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
				console.log(form_data);
			}
		}

		var fb = Property.addImage(mPropertyId, form_data)
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

	// Function Delete Images, Category & Description data to backend

	function deleteImagesCategoryDescription() {
		var currentRow = $(this).closest("tr");
		var col2 = currentRow.find("td:eq(3)").text();
		var col3 = currentRow.find("#yourImgId").attr('src');
		var imageID = $(this).val();

		var data = "Are you sure to delete this Image?";

		if (confirm(data)) {
			Property.deletePropertyImage(mPropertyId, imageID).done((property) => {
				$(".Delete_LandMark" + imageID).remove();

				// Refresh
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
