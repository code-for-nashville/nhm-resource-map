<template>

  	<!-- right side panel -->
	<section id="results-panel" class="side-nav side-panel"><!-- id=nav-mobile -->
	    <h6 class="center"><strong>Find {{resourceTypeAsTitle}}</strong></h6>

	    

	    <!-- Urgent Needs Search -->
	    <div v-show="resourceType === 'urgent-needs'" class="search-form-wrapper urgent-needs">
	      <div class="row">
	        <form class="col s12 search-form">
	          
	          <div class="row">
	            <div class="input-field col s12">
	              <input id="urgent-need" type="text" name="search" v-model="search">
	              <label for="urgent-need">Keyword(s)</label>
	            </div>
	          
	            <div class="input-field col s12">
	              <input type="date" name="urgentNeedDate" class="datepicker" v-change="doDateFieldChange" v-model="urgentNeedDate">
	              <label for="urgentNeedDate">Up to Date</label>
	            </div>

	            <div class="input-field col s12">
	              <button class="btn waves-effect waves-light right" type="submit" name="action" v-on:click.prevent="doTriggerSearch">Search
	                <i class="material-icons right">search</i>
	              </button>
	            </div>
	          </div>

	        </form>
	      </div>
	    </div>

	    <!-- Events Search -->
	    <div v-show="resourceType === 'events'" class="search-form-wrapper events">
	      <div class="row">
	        <form class="col s12 search-form">
	          
	          <div class="row">
	            <div class="input-field col s12">
	              <input id="event" type="text" name="search" v-model="search">
	              <label for="event">Keyword(s)</label>
	            </div>
	          
	            <div class="input-field col s12">
	              <input type="date" name="startDate" class="datepicker" v-change="doDateFieldChange" v-model="startDate">
	              <label for="startDate">Start Date</label>
	            </div>

	            <div class="input-field col s12">
	              <input type="date" name="endDate" class="datepicker" v-change="doDateFieldChange" v-model="endDate">
	              <label for="endDate">End Date</label>
	            </div>

	            <div class="input-field col s12">
	              <button class="btn waves-effect waves-light right" type="submit" name="action" v-on:click.prevent="doTriggerSearch">Search
	                <i class="material-icons right">search</i>
	              </button>
	            </div>
	          </div>

	        </form>
	      </div>
	    </div>

	    <!-- Resources Search -->
	    <div v-show="resourceType === 'resources'" class="search-form-wrapper resources">
	      <div class="row">
	        <form class="col s12 search-form">
	          
	          <div class="row">
	            <div class="input-field col s12">
	              <input id="search" type="text" name="search" v-model="search">
	              <label for="search">Search</label>
	            </div>
	          
	            <div class="input-field col s12">
	              <select class="icons" name="service" v-change="doServiceChange">
	                <option value="" selected>Choose a service</option>
	                <option v-for="srvc in services" :value="srvc.id" :data-icon="srvc.icon" class="left circle">{{srvc.name}}</option>
	              </select>
	              <label for="service">Service</label>
	            </div>

	            <div class="input-field col s12">
	              <button class="btn waves-effect waves-light right" type="submit" name="action" v-on:click.prevent="doTriggerSearch">Search
	                <i class="material-icons right">search</i>
	              </button>
	            </div>
	          </div>

	        </form>
	      </div>
	    </div>

	    <div class="search-results">
	      <div v-show="results.length > 0" class="row">
	        {{ results }}
	      </div>
	      <div v-show="results.length == 0" class="row">
	      	No Results Found!
	      </div>
	    </div>

	</section>

</template>


<script>
	import { eventBus, resourceTypes } from '../main';
	import nhmservice from '../gateways/nhmservice';
	require('materialize-css/dist/js/materialize');

	//console.log(resourceTypes);

	export default {
		name: 'nhm-results-panel',

		data() {
			return {
				resourceType: resourceTypes.RESOURCES.name,
				services: [],
				search: null,
				startDate: null,
				endDate: null,
				urgentNeedDate: null,
				selected_service: null
			};
		},
		props: {
			results: {
				type: Array,
				default: [], 
				required: false
			}
		},
		created() {
		},

		mounted() {
			// Initialize the right side panel
			$('.results-panel-trigger').sideNav({
		    	edge: 'right',
		    	width: 420
		    });

		    // Register to listen on eventBus
			eventBus.$on('select-resource-type', resourceType => {
				//console.log('bus: received select-resource-type event. Showing...', resourceType);
				
				this.resourceType = resourceType;
				Materialize.updateTextFields();  //update the text fields

				//console.log(this.results, this.resourceType);
			});

			console.log("NhmResultsPanel mounted", this.services);

			// fetch the services
			nhmservice.getServices(this).then((response) => {
				this.services = response.data;
				//this.$set(this.services, response.data);
				//console.log('got data...', this.services);

			}, (err) => {
				//context.error = err;
				console.log('whoops...error...', err);
			});
		},

		updated() {
			$('select:not([multiple])').material_select();
		},
		computed: {
			resourceTypeAsTitle: function() {
				if(this.resourceType) {
					var cleaned = this.resourceType.replace('-', ' '),
						tempA = cleaned.split(' '),
						tempB = tempA.map(function(item, idx){
							return item.charAt(0).toUpperCase() + item.slice(1);
						}),
						printReady = tempB.join(' ');
					return printReady;
				}
				return "Resources"
			}
		},
		methods: {
			showPanel: function(param) {

			},
			doServiceChange: function(el) {
				this.selected_service = $(el).val();
				console.log("selected_service: ", this.selected_service);
			},
			doDateFieldChange: function(el) {
				var target = $(el).attr('name'),
					val = $(el).val();

				switch(target) {
					case 'startDate':
						this.startDate = val;
						break;
					case 'endDate':
						this.endDate = val;
						break;
					case 'urgentNeedDate':
						this.urgentNeedDate = val;
						break;
					default:
						break;
				}

				console.log('DateField changed...', target, val);
			},
			doTriggerSearch: function() {
				var params = {
					resourceType: this.resourceType,
					search: this.search
				};
				switch(this.resourceType) {
					case resourceTypes.RESOURCES.name:
						params['service'] = this.selected_service;
						break;
					case resourceTypes.EVENTS.name:
						params['startDate'] = this.startDate;
						params['endDate'] = this.endDate;
						break;
					case resourceTypes.URGENTNEEDS.name:
						params['urgentNeedDate'] = this.urgentNeedDate;
						break;
					default:
						break;
				}
				this.$emit('do-search', params);
			}
		},
		directives: {
			change: {
				bind: function(el, binding, vnode) {
					
					$(el).on('change', function(e) {
						if(binding.value && (typeof binding.value === 'function')) {
							binding.value(el);
						} else {
							console.log('select change: binding value was null or not a function!');
						}
					});
				},
				unbind: function(el) {
					$(el).off('change');
				}
			}
		}
	}

</script>


<style scoped>

	.side-panel {
		padding:20px;
		color: #676767;
	}

</style>