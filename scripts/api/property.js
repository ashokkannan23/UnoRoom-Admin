// All Property APIs
var Property = (() => {
	// List all properties
	var listProperties = () => Api.httpGet('facility/');
	// Get details of a property
	var getProperty = (propertyid) => Api.httpGet('facility/' + propertyid);

	// Creating a new property
	function PropertyBuilder() {
		var _id;
		var payload = {};
		this.setId = (id) => {
			_id = id;
			return this;
		}
		this.addName = (name) => {
			payload.name = name;
			return this;
		}
		this.addPhoneNumber = (phonenumber) => {
			if (payload.phonenumber1)
				payload.phonenumber2 = phonenumber;
			else
				payload.phonenumber1 = phonenumber;
			return this;
		}
		this.addEmailId = (emailid) => {
			payload.emailid = emailid;
			return this;
		}
		this.addBuildingType = (buildingType) => {
			payload.buildingtype = buildingType;
			return this;
		}
		this.addAddress = (address) => {
			if (!payload.address)
				payload.address = {};
			if (!payload.address.line1)
				payload.address.line1 = address;
			else
				payload.address.line2 = address;
			return this;
		}
		this.addLocality = (locality) => {
			if (!payload.address)
				payload.address = {};
			payload.address.locality = locality;
			return this;
		}
		this.addCity = (city) => {
			if (!payload.address)
				payload.address = {};
			payload.address.city = city;
			return this;
		}
		this.addState = (state) => {
			if (!payload.address)
				payload.address = {};
			payload.address.state = state;
			return this;
		}
		this.addPincode = (pincode) => {
			if (!payload.address)
				payload.address = {};
			payload.address.pin = pincode;
			return this;
		}
		this.addCountry = (country) => {
			if (!payload.address)
				payload.address = {};
			payload.address.country = country;
			return this;
		}
		this.addAmenities = (amenity) => {
			if (!payload.amenities)
				payload.amenities = [];
			payload.amenities.push(amenity);
			return this;
		}
		this.addRules = (rule) => {
			if (!payload.rules)
				payload.rules = [];
			payload.rules.push(rule);
			return this;
		}
		this.addDescription = (Description) => {
			payload.description = Description;
			return this;
		}
		this.create = () => {
			if (!payload.name ||
				!payload.phonenumber1 ||
				!payload.emailid) {
				return $.Deferred().reject({
					code: 400,
					message: 'Incorrect data'
				});
			}
			return Api.httpPost('facility/', payload, true);
		}
		this.update = () => {
			if (!_id)
				return $.Deferred().reject({
					code: 400,
					message: 'Property id not specified'
				});
			return Api.httpPut('facility/' + _id, payload, true);
		}
	}

	/**
	 * Publishing a Property
	 * @param facilityid: Property Id to be published
	 */
	var publishProperty = (propertyid) => {
		return Api.httpPut('facility/publish/' + propertyid, null, true);
	}

	/**
	 * Delisting a Property
	 * @param facilityid: Property Id to be delisted
	 */
	var delistProperty = (propertyid) => {
		return Api.httpPut('facility/delist/' + propertyid, null, true);
	}

	/**
	 * Add a nearyby to a property
	 */
	var addNearbyToProperty = (propertyid, name, type, distance, latitude, longitude) => {
		var nearyby = {
			name,
			locationtype: type,
			distanceinmeters: distance,
			location: { latitude, longitude }
		};
		return Api.httpPost('facility/nearby/' + propertyid, nearyby, true);
	}

	/**
	 * Update nearby
	 */
	var updateNearby = (propertyid, nearbyid, name, type, distance, latitude, longitude) => {
		var nearyby = {
			name,
			locationtype: type,
			distanceinmeters: distance,
			location: { latitude, longitude }
		};
		return Api.httpPut('facility/nearby/' + propertyid + '/' + nearbyid, nearyby, true);
	}

	/**
	 * Delete near by
	 */
	var deleteNearby = (propertyid, nearbyid) => {
		return Api.httpDelete('facility/nearby/' + propertyid + '/' + nearbyid, true);
	}

	/**
	 * Add an images to a property
	 */
	var addImage = (propertyid, form_data) => {
		var addimages = {
			form_data
		};
		return Api.httpPostImage('facility/image/' + propertyid, form_data, true);
	}
	
	/**
	 * Delete an images to a property
	 */
	var deletePropertyImage = (propertyid, imageID) => {
		return Api.httpDeleteImage('facility/image/' + propertyid + '/' + imageID, true);
	}

	/**
	 * Room Builder
	 */
	function RoomBuilder() {
		var _id;
		var propertyid;
		var payload = {};
		this.setId = (id) => {
			_id = id;
			return this;
		}
		this.setPropertyId = (id) => {
			propertyid = id;
			return this;
		}
		this.addName = (name) => {
			payload.name = name;
			return this;
		}
		this.addType = (type) => {
			payload.type = type;
			return this;
		}
		this.addAmenities = (amenity) => {
			if (!payload.amenities)
				payload.amenities = [];
			payload.amenities.push(amenity);
			return this;
		}
		this.addSize = (size) => {
			payload.size = size;
			return this;
		}
		this.addPrice = (price) => {
			payload.price = price;
			return this;
		}
		this.addRoomCount = (count) => {
			payload.count = count;
			return this;
		}
		this.create = () => {
			if (!propertyid ||
				!payload.name ||
				!payload.count ||
				!payload.type) {
				return $.Deferred().reject({
					code: 400,
					message: 'Incorrect data'
				});
			}
			return Api.httpPost('facility/room/' + propertyid, payload, true);
		}
		this.update = () => {
			if (!_id)
				return $.Deferred().reject({
					code: 400,
					message: 'Room id not specified'
				});
			if (!propertyid)
				return $.Deferred().reject({
					code: 400,
					message: 'Property id not specified'
				});
			return Api.httpPut('facility/room/' + propertyid + '/' + _id, payload, true);
		}
	}
	
	/**
	 * Delete Rooms / Apartment
	 */
	var deleteRoom = (propertyid, roomId) => {
		return Api.httpDelete('facility/room/' + propertyid + '/' + roomId, true);
	}
	
	/**
	 * Add Room images to a property
	 */
	var addRoomImage = (propertyid,roomimageID, form_data) => {
		var addroomimages = {
			form_data
		};
		return Api.httpPostImage('facility/room/image/' + propertyid + '/' + roomimageID, form_data, true);
	}
	
	/**
	 * Delete Room images to a property
	 */
	var deleteRoomImage = (propertyid, roomID, roomimageID) => {
		return Api.httpDeleteImage('facility/room/image/' + propertyid + '/' + roomID + '/' + roomimageID, true);
	}
	
	
	
	/**
	 * Update amenities
	 */
	var updateAmenities = (propertyid, amenities, rules) => {
		var payload = {
			amenities,
			rules
		};
		return Api.httpPut('facility/' + propertyid, payload, true);
	}
	
	

	return {
		listProperties,
		getProperty,
		PropertyBuilder,
		RoomBuilder,
		publishProperty,
		delistProperty,
		addNearbyToProperty,
		updateNearby,
		deleteNearby,
		addImage,
		deletePropertyImage,
		deleteRoom,
		addRoomImage,
		deleteRoomImage,
		updateAmenities
	}
})();
