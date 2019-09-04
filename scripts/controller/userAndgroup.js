(() => {

	// assigning gloabal variable
	var mUserList;
	var mAllRoles;

	$(document).ready(() => {
		if (!Auth.isLoggedIn()) {
			//go to login
			Nav.gotoLogin();
			return;
		}

		// Fetch All user List
		fetchAllUserList();

		//fetchUserRole in drop down;
		UserRollDropdown();

		$(document).on('click', '#SignOut', function () {
			Auth.logout();
			//go to login
			Nav.gotoLogin();
		});
	}); // document.ready()

	// Function for Fetch All user List
	function fetchAllUserList() {
		//Get user List data from backend
		User.getAllUsers().done((users) => {
			mUserList = users;
			var UserListHtml = '';
			var UserListLength = mUserList.length;

			for (i = 0; i <= UserListLength - 1; i++) {

				UserListHtml += '<tr class="">' +

				'<td><button  class="btn btn-light UserList _id" type="button" value="">' + mUserList[i].firstname + '</button></td>' +

				'<td><button   class="btn btn-light UserList City" type="button" value="">' + mUserList[i].lastname + '</button></td>' +

				'<td><button   class="btn btn-light UserList Locality" type="button" value="">' + mUserList[i].username + '</button></td>' +

				'<td><button  class="btn btn-light UserList roletype" value="' + mUserList[i].role + '" type="button">' + mUserList[i].role + '</button></td>' +

				'<td><button  class="btn btn-light UserList EditBuilding" value="" type="button"><i class="fa fa-pencil" aria-hidden="true"></i></button>';

				var buttonClassName = (mUserList[i].active == true) ? 'DeactiveUser' : 'ActiveUser';
				var imgClassName = (mUserList[i].active == true) ? 'fa-check-circle' : 'fa-times-circle';
				var iconColor = (mUserList[i].active == true) ? 'greenColorIcon' : 'redColorIcon';

				UserListHtml += '<button class="btn btn-light userID ' + buttonClassName + ' ' + iconColor + '" value="' + mUserList[i]._id + '" type="button"><i class="fa ' + imgClassName + '" aria-hidden="tru +e"></i></button></td></tr>';

				$("#UserListTable > tbody").html(UserListHtml);

				// Handle Save button
				$(document).on('click', '#save_user', saveUser);
				
				// Handle update button click
				$(document).on('click', '#Update_user', UpdateUser);

				// Handle Publish button
				$(document).on('click', '.ActiveUser', makeActiveUser);

				// Handle Delist button
				$(document).on('click', '.DeactiveUser', makeDeactiveUser);

				// Search by "pressing enter Button Don't Refresh Page"
				document.getElementById('search-field').addEventListener('keypress', function (event) {
					if (event.keyCode == 13) {
						event.preventDefault();
						searchUsers();
					}
				});

				// Search by "Clicking Don't Refresh Page"
				$('#searchUser').on('click', function (event) {
					event.preventDefault();
					searchUsers();
				});

				// Handle Edit button
				$("#UserListTable").on('click', '.UserList', editUser);

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

			};
		});

	}

	// Function for User roll dropdown
	function UserRollDropdown() {
		// Fetch user role drop-down
		Meta.getRoles().done((roles) => {
			mAllRoles = roles;
			var rolehtml = roles.reduce((acc, cv) => {

					acc += '<option value="' + cv + '">' + cv + '</option>';
					return acc;
				}, '');
			$('#role').html(rolehtml);
		});
	}

	// Function for create user in backend
	function saveUser() {
		if (!uiValidationPassed())
			return;

		User.createUser($("#first_name").val(),
			$("#last_name").val(),
			$("#email_Id").val(),
			$("#password").val(),
			$("#role").val())
		.done((user) => {
			// Success Handler
			console.log(JSON.stringify(user))
			var getuserId = user._id;
			// Refresh UI
			location.reload();

		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});

	}
	
	// Function for Update user in backend
	function UpdateUser() {
		if (!uiValidationPassed())
			return;
		
		var userId = Utils.getURLParameter('user_id', window.location);

		User.updateUser(userId, 
						$("#first_name").val(),
						$("#last_name").val())
		.done((user) => {
			// Success Handler
			console.log(JSON.stringify(user))
			var getuserId = user._id;
			// Refresh UI
			location.reload();

		}).fail((e) => {
			// Error handler
			console.log(JSON.stringify(e));
		});

	}

	// Function to make Active user to backend
	function makeActiveUser() {

		var userId = $(this).val();

		User.activateUser(userId).done(() => {
			// Refresh
			location.reload();

		});

	}

	// Function to make DeactiveUser user to backend
	function makeDeactiveUser() {
		var userId = $(this).val();

		User.deActivateUser(userId).done(() => {
			// Refresh
			location.reload();

		});
	}

	// Function for EditUser to backend
	function editUser() {
		var currentRow = $(this).closest("tr");
		var userId = currentRow.find(".userID").val();

		var edited = mUserList;
		for (var i in edited) {
			if ((userId == edited[i]._id)) {
				$("#first_name").attr("value", edited[i].firstname);
				$("#last_name").attr("value", edited[i].lastname);
				$("#email_Id").attr("value", edited[i].username).prop("disabled", true);
				$("#password").attr("value", 'xxxxxxx').prop("disabled", true);
				
				var rolehtml;
				
				rolehtml = mAllRoles.reduce((acc, cv) => {
							if (cv === edited[i].role) {
								acc += '<option selected value="' + cv + '">' + cv + '</option>';
							} else {
								acc += '<option value="' + cv + '">' + cv + '</option>';
							}
							return acc;
						}, '');
				$('#role').html(rolehtml).prop("disabled", true); 
			}
		}

		if (history.pushState) {
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?user_id=' + userId;
			window.history.pushState({
				path: newurl
			}, '', newurl);
		}
		$("#Update_user").show();
		$("#save_user").css('display', 'none');
	}

	// Function for search user
	function searchUsers() {
		var input,
		filter,
		table,
		tr,
		td,
		i,
		txtValue;
		input = document.getElementById("search-field");
		filter = input.value.toUpperCase();

		table = document.getElementById("UserListTable");
		tr = table.getElementsByTagName("tr");

		for (i = 1; i < tr.length; i++) {

			var userFirstName,
			userLastName,
			userEmailid,
			userRole;

			var firstName = tr[i].getElementsByTagName("td")[0];
			if (firstName)
				userFirstName = firstName.textContent || firstName.innerText;
			var lastName = tr[i].getElementsByTagName("td")[1];
			if (lastName)
				userLastName = lastName.textContent || lastName.innerText;

			var emailID = tr[i].getElementsByTagName("td")[2];
			if (emailID)
				userEmailid = emailID.textContent || emailID.innerText;

			var role = tr[i].getElementsByTagName("td")[3];
			if (role)
				userRole = role.textContent || role.innerText;

			if ((userFirstName && userFirstName.toUpperCase().indexOf(filter) > -1) ||
				(userLastName && userLastName.toUpperCase().indexOf(filter) > -1) ||
				(userEmailid && userEmailid.toUpperCase().indexOf(filter) > -1) ||
				(userRole && userRole.toUpperCase().indexOf(filter) > -1)) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}

	// Function for goTop
	function goTop() {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

	}

	// Validate all UI fields.
	var uiValidationPassed = () => {
		var firstname = $("#first_name").val();
		var lastname = $("#last_name").val();
		var emailid = $("#email_Id").val();
		var password = $("#password").val();
		// var role = $("#role option:selected").val();

		if (firstname == "") {
			$('#firstname').html("First Name must be filled out");
		} else {
			$('#firstname').html("");

		}

		if (lastname == "") {
			$("#lastname").html("Last Name must be filled out");
		} else {
			$("#lastname").html("");
		}
		if (!emailid) {
			$("#email").html("Email ID must be filled");
		} else if (!Utils.validateEmailId(emailid)) {
			$("#email").html("Email ID should be xyz@gmail.com Format");
		} else {
			$("#email").html("");
		}

		if (!password) {
			$('#pswd').html("Password must be filled out");
		} else {
			$('#pswd').html("");

		}

		// if (role == undefined) {
		// $("#msg").html("Please select the role");
		// } else {
		// $("#msg").html("");
		// }

		if (firstname == "") {
			return false;
		}

		if (lastname == "") {
			return false;
		}
		if (emailid == "") {
			return false;
		} else if (!Utils.validateEmailId(emailid)) {
			return false;
		}
		if (!password) {
			return false;
		}

		// if (role == undefined) {

		// return false;
		// }


		return true;

	}
})();
