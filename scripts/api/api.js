var Api = (() => {
	const API_HOST = 'http://192.168.1.211';
	const API_PORT = '3000';

	var getBaseUrl = () => (API_HOST + ':' + API_PORT + '/');

	function addAuthenticationHeader(request) {
		request.setRequestHeader("auth.Authorization", localStorage.getItem('token'));
	}

	function noOpHeader(request) {}

	/**
	 * HTTP GET Method
	 */
	var httpGet = (path, isAuthenticated) => {
		return $.ajax({
			type: 'GET',
			// beforeSend: isAuthenticated ? addAuthenticationHeader : noOpHeader,
			url: getBaseUrl() + path,
			contentType: "application/json",
			dataType: 'json'
		}).then(null, (e) => {
			throw {
				status: e.status,
				message: e.responseJSON.message
			};
		});
	};

	// /**
	 // * HTTP POST Method
	 // */
	// var httpPost = (path, payload, isAuthenticated) => {
		// return $.ajax({
			// type: 'POST',
			// beforeSend: isAuthenticated ? addAuthenticationHeader : noOpHeader,
			// url: getBaseUrl() + path,
			// data: JSON.stringify(payload),
			// contentType: "application/json",
			// dataType: 'json'
		// }).then(null, (e) => {
			// throw {
				// status: e.status,
				// message: e.responseJSON.message
			// };
		// });
	// };
	
	
		/**
	 * HTTP POST Method
	 */
	var httpPost = (path, payload, isAuthenticated) => {
		var requestObj = {
			type: 'POST',
			beforeSend: isAuthenticated ? addAuthenticationHeader : noOpHeader,
			url: getBaseUrl() + path,
			contentType: "application/json",
			dataType: 'json'
		};
		if (payload)
			requestObj['data'] = JSON.stringify(payload);

		return $.ajax(requestObj).then(null, (e) => {
			throw {
				status: e.status,
				message: e.responseJSON.message
			};
		});
	};
	
	
	
	

	/**
	 * HTTP PUT Method
	 */
	var httpPut = (path, payload, isAuthenticated) => {
		var requestObj = {
			type: 'PUT',
			// beforeSend: isAuthenticated ? addAuthenticationHeader : noOpHeader,
			url: getBaseUrl() + path,
			contentType: "application/json",
			dataType: 'json'
		};
		if (payload)
			requestObj['data'] = JSON.stringify(payload);

		return $.ajax(requestObj).then(null, (e) => {
			throw {
				status: e.status,
				message: e.responseJSON.message
			};
		});
	};

	/**
	 * HTTP DELETE Method
	 */
	var httpDelete = (path, isAuthenticated) => {
		return $.ajax({
			type: 'DELETE',
			url: getBaseUrl() + path,
			contentType: "application/json",
			dataType: 'json'
		}).then(null, (e) => {
			throw {
				status: e.status,
				message: e.responseJSON.message
			};
		});
	}

	/**
	 * Upload Images
	 */
	var httpPostImage = (path, payload, isAuthenticated) => {
		return $.ajax({
			type: 'POST',
			// beforeSend: isAuthenticated ? addAuthenticationHeader : noOpHeader,
			url: getBaseUrl() + path,
			data: payload,
			contentType: false,
			cache: false,
			processData: false
		}).then(null, (e) => {
			throw {
				status: e.status,
				message: e.responseJSON.message
			};
		});
	};

	/**
	 * HTTP IMNAGE DELETE Method
	 */
	var httpDeleteImage = (path, isAuthenticated) => {
		return $.ajax({
			type: 'DELETE',
			url: getBaseUrl() + path,
			contentType: "application/json"
		}).then(null, (e) => {
			throw {
				status: e.status,
				message: e.responseJSON.message
			};
		});
	}
	
	

	

	return {
		httpGet,
		httpPost,
		httpPut,
		httpDelete,
		httpPostImage,
		httpDeleteImage
	};
})();
