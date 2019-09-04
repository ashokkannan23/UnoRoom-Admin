var Nav = (() => {
	var pageRoot;
	
	function init(root) {
		localStorage.setItem('nav.root', (root.endsWith('index.html') ? root.slice(0, root.indexOf('index.html')) : root));
	}
	
	var goto = (absolutePath) => {
        var pageRoot = localStorage.getItem('nav.root');
		window.location.assign(pageRoot + absolutePath);
	};
	
	var gotoDashboard = () => {
		goto('dashboard.html');
	};
    
    var gotoLogin = () => {
        goto('index.html');
    }
	
	var gotoBrowseProperty = () => {
		goto('browse-properties.html');
	};
	
	var gotoAddProperty = () => {
		goto('add-building.html');
	}
	
	var gotoViewProperty = (propertyid) => {
		goto('view-building-browse.html?building_id=' + propertyid);
	}
	
	var gotoLandmark = (propertyid) => {
		goto('add-building-landmark.html?building_id=' + propertyid);
	}
	
	var gotoAmenities = (propertyid) => {
		goto('add-building-amenities.html?building_id=' + propertyid);
	}
	
	var gotoAddBuildingImages = (propertyid) => {
		goto('add-building-images.html?building_id=' + propertyid);
	}
	
	var gotoAddRooms = (propertyid) => {
		goto('addRoomandApartment.html?building_id=' + propertyid);
	}
	
	var gotoSearchByCity = () => {
		goto('add-search-city-places.html');
	}
	
	var gotoFeaturedProperty = () => {
		goto('add-featured-property.html');
	}
	
	return {
		init,
		gotoDashboard,
        gotoLogin,
		gotoBrowseProperty,
		gotoAddProperty,
		gotoViewProperty,
		gotoLandmark,
		gotoAmenities,
		gotoAddBuildingImages,
		gotoAddRooms,
		gotoSearchByCity,
		gotoFeaturedProperty
	};
})();