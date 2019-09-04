(() => {
	$(document).ready(() => {
		
		var input = document.getElementsByClassName("myInput");
		$(input).keyup(function (event) {
			if (event.keyCode === 13) {
				$("#user_authentication").click();
			}
		});

		$('#user_authentication').on('click', () => {

			if (!uiValidationPassed())
				return;

			var username = $("#username").val();
			var password = $("#password").val();

			Auth.login(username, password).done((data) => {
				var Token = data.token;
				var UserID = data.userid;
				var Role = data.role;
				// go to dashboard if login success
				Nav.gotoDashboard();
			}).fail((e) => {
				// Error handler
				console.log(JSON.stringify(e));
				var status = e.status;
				if (status == 401) {
					$('#invalid-user-pass').html("UserID / Password is Incorrect");
				}
			});
		});

		// Validate all UI fields.
		// Should be invoked before creating a property.
		var uiValidationPassed = () => {
			var username = $("#username").val();
			var password = $("#password").val();

			if (!username) {
				$('#user-error').html("UserID must be filled out");
			} else {
				$('#user-error').html("");
			}

			if (!password) {
				$('#password-error').html("Password must be filled out");
			} else {
				$('#password-error').html("");

			}

			if (!username) {
				return false;
			}

			if (!password) {
				return false;
			}

			return true;
		}

	}); // document.ready()
})();
