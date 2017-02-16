<template>

	<div id="map" class="section no-pad map-container main-section">
	    <h4>Map goes here...</h4>
	</div>

</template>


<script>
	import { eventBus, resourceTypes } from '../main';
	import nhmservice from '../gateways/nhmservice';
	require('materialize-css/dist/js/materialize');
	
	import GMaps from 'gmaps/gmaps.min.js';

	const defaultType = 'resources';

	//console.log(resourceTypes);

	export default {
		name: 'nhm-map',

		data() {
			return {
				resourceType: resourceTypes.RESOURCES.name,
				results: [],
				searchParams: {
					search: null,
					keyword: null,
					service: null,
					startDate: null,
					endDate: null,
					urgentNeedDate: null
				},
				resourceMap: null,
			};
		},
		created() {
		},

		mounted() {
			// Initialize ...
			// load GMaps
			if(GMaps) {
				console.log("...found GMaps, loading map...");
				this.resourceMap = new GMaps({
					div: '#map',
					lat: 36.174465,
					lng: -86.767960,
				});
			} else {
				console.log("...could not find GMaps on window object.");
			}
			

		    // Register to listen on eventBus
			eventBus.$on('select-resource-type', resourceType => {
				//console.log('bus: received select-resource-type event. Showing...', resourceType);
				
				this.resourceType = resourceType;

				//console.log(this.results, this.resourceType);
			});

			console.log("NhmMap mounted");
		},

		updated() {
			//update markers if necessary
		},

		methods: {
			doSearch: function(param) {
				// fetch the services
				/*
				nhmservice.getServices(this).then((response) => {
					this.services = response.data;
					//this.$set(this.services, response.data);
					console.log('got data...', this.services);
					//$('select:not([multiple])').material_select();

				}, (err) => {
					//context.error = err;
					console.log('whoops...error...', err);
				});
				*/
			}
		}
	}

</script>


<style scoped>
	/* Map Container */
	.map-container {
		width: 100vw;
		height: 100vh;
		
		background-color: #999;
	}

</style>