var User = (() => {
	
	//create user
	var createUser = (firstname, lastname, emailid, password, role) => {
		var payload = {
			firstname,
			lastname,
			emailid,
			password,
			role
		};
	return Api.httpPost('user', payload, true);
	}
	
	// update user
	var updateUser = (userId, firstname, lastname) => {
		var payload = {
			firstname,
			lastname
		};
		return Api.httpPut('user/' + userId, payload, true);
	}
	
	// activate user
	var activateUser = (userId) => {
		return Api.httpPost('user/activate/' + userId, null, true);
	}
	
	// deactivate user
	var deActivateUser = (userId) => {
		return Api.httpPost('user/deactivate/' + userId, null, true);
	}
	
	// Get all User list
	var getAllUsers = () => Api.httpGet('user/');
	
	return {
		createUser,
		updateUser,
		activateUser,
		deActivateUser,
		getAllUsers
		
	}
})();