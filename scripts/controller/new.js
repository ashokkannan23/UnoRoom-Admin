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