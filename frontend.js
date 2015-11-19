var streets = [];
var img_dir = '/streets/images/';
var street_file = '/streets/streets.min.json';

function doSearch() {

	// take out previous results
	$('#results').text('');

	// figure out which districts to search
	var enabled_districts = [];

	if ($('#dist_51').prop('checked')) {
		enabled_districts.push('51');
	}

	if ($('#dist_52').prop('checked')) {
		enabled_districts.push('52');
	}

	if ($('#dist_53').prop('checked')) {
		enabled_districts.push('53');
	}

	// perform the search
	var f = new Fuse(streets, {keys: ['name', 'alternates'], threshold: 0.3});
	var result = f.search($('#search').val());

	// display results
	result.forEach(function(street) {

		// ensure it is in an enabled district
		if (enabled_districts.indexOf(street.district) > -1) {

			var html = '<div class="street">'
				+ '<p class="name">' + street.name + '</p>';

			if (street.hasOwnProperty("route")) {
				html += '<p class="directions">' + street.route + '</p>';
			} else if (street.hasOwnProperty("routes")) {

				street.routes.forEach(function(route) {
					html += '<div class="route">'
						+ '<p class="title">' + route.title + '</p>'
						+ '<p class="directions">' + route.route + '</p>'
						+ '</div>';
				});
			}

			if (street.hasOwnProperty('note')) {
				html += '<p class="note">' + street.note + '</p>';
			}

			if (street.hasOwnProperty('image')) {
				html += '<a href="' + img_dir + street.image + '"><img src="' + img_dir + street.image + '" alt="map" /></a>';
			}

			// add street to the results
			$('#results').append(html);
		}

	});

}


$(document).ready(function() {

	// give focus to search box
	$('#search').focus();

	// load the streets
	$.getJSON(street_file, function (data) {
		streets = data;
	});

	// search when value changed
	$('#search').keyup(doSearch);

	// search and refocus when checkboxes change
	$(':checkbox').change(function () {
		doSearch();
		$('#search').focus();
	});

	$('#dist_51').prop('checked', true);

});