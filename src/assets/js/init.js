(function($){
  $(function(){

  	//initializations
    $('.login-panel-trigger').sideNav();

    $('.results-panel-trigger').sideNav({
    	edge: 'right',
    	width: 360
    });

    // Select - Single
    $('select:not([multiple])').material_select();

    $('.datepicker').pickadate({
		selectMonths: true, // Creates a dropdown to control month
	    selectYears: 3, // Creates a dropdown of 3 years to control year
	    container: 'body',
	    closeOnSelect: true
	});


	// interactions
	$('.results-panel-trigger').on('click', function(evt){
		evt.preventDefault();

		var $culprit = $(this),
			name = $culprit.attr('data-name');

		$('.search-form-wrapper').removeClass('active');
		$('.search-form-wrapper.' + name).addClass('active');
	});

	// load GMaps
	if(window.GMaps) {
		console.log("...found GMaps, loading map...");
		window.RESOURCEMAP = new GMaps({
			div: '#map',
			lat: 36.174465,
			lng: -86.767960,
		});
	}
	

  }); // end of document ready
})(jQuery); // end of jQuery name space