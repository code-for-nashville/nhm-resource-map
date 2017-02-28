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
	              <select class="icons service-options" name="service" v-change="doServiceChange">
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
	      <div v-show="results.length > 0 && resourceType === 'resources'" class="row">
	        <em>{{results.length}} organizations found</em><br/>
			<ul v-for="provider in results" class="collection">
			    <li v-for="location in provider.locations" class="collection-item avatar">
			    	
		      		<img v-if="provider.avatar" :src="provider.avatar" alt="" class="circle" />
		      		<img v-else :src="getServiceIcon(provider)" alt="" class="circle" />
		      		<span class="title" @click="doProviderClicked(provider, location)">{{ provider.name }}</span>
			      	<p><!-- {{ location.name }}<br/>
			        	{{ location.address1 }}<br/>
			        	<span v-if="location.address2">{{ location.address2 }} -->
			        	{{ location.zip }}
			      	</p>
			      	<!-- <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a> -->
			    </li>
			</ul>
	      </div>

	      <div v-show="results.length > 0 && resourceType === 'events'" class="row">
	        <em>{{results.length}} events found</em><br/>
			<ul class="collection">
			    <li v-for="event in results" class="collection-item avatar event">
		      		<span class="event-date">
						<span class="month">{{event.event_month}}</span>
						<span class="day-of">{{event.event_day_of_month}}</span>
		      		</span>
		      		<span class="title" @click="doEventClicked(event)">{{ event.title }}</span>
			      	<p>
			      		<span class="time">{{ event.event_starttime }}</span>
			        	<span v-if="event.event_url">{{ event.event_url }}</span> <br/>
			        	<span class="host">by {{ event.event_host }}</span>
			      	</p>
			      	<!-- <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a> -->
			    </li>
			</ul>
	      </div>

	      <div v-show="results.length > 0 && resourceType === 'urgent-needs'" class="row">
	        <em>{{results.length}} urgent needs found</em><br/>
	        <small><em>ordered by expiration time</em></small><br/>
			<ul class="collection">
			    <li v-for="need in results" :class="{urgent: need.time_left_units === 'hours'}" class="collection-item avatar need">
		      		<span class="event-date">
						<span class="time-left">{{need.time_left}}</span>
						<span class="units">{{need.time_left_units}}</span>
		      		</span>
		      		<span class="title" @click="doUrgentNeedClicked(need)">{{ need.title }}</span>
			      	<p>
			      		<span v-if="need.start_datetime" class="time">posted on {{ need.event_month }} {{ need.event_day_of_month }}, {{ need.event_year }}</span>
			        	<span v-if="need.event_url">{{ need.event_url }}</span> <br/>
			        	<span class="host">by {{ need.event_host }}</span>
			      	</p>
			      	<!-- <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a> -->
			    </li>
			</ul>
	      </div>

	      <div v-show="results.length == 0" class="row">
	      	No Results Found!
	      </div>
	    </div>

	</section>

</template>


<script>
	import { eventBus, resourceTypes } from '../main';
	require('materialize-css/dist/js/materialize');

	//console.log(resourceTypes);

	export default {
		name: 'nhm-results-panel',

		data() {
			return {
				//resourceType: resourceTypes.RESOURCES.name,
				//services: [],
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
			},
			resourceType: {
				type: String,
				default: 'resources',
				required: true
			},
			services: {
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
				Materialize.updateTextFields();  //update the text fields
			});

			console.log("NhmResultsPanel mounted", this.services);
		},

		updated() {
			$('select:not([multiple])').material_select();
			console.log("NhmResultsPanel updated...");
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
			},
			getServiceIcon(provider) {
				var p_srvc = provider ? provider.services[0].id : '',
					srvc = this.selected_service ? parseInt(this.selected_service) : p_srvc;

				//console.log(provider, srvc, p_srvc);

				for(let x=0; x < this.services.length; x++) {
					//console.log(srvc, this.services[x])
					if(this.services[x].id === srvc) {
						return this.services[x].icon;
					}
				}
				console.log('returning ../assets/img/mhrc_logo.png')
				return "/static/img/mhrc_logo.png";
			},
			doProviderClicked(provider, location) {
				console.log('provider clicked: ' + provider.name + ' ' + location.name);
				this.$emit('popup-provider', provider.id, location);
			},
			doEventClicked(event) {
				console.log('event clicked: ' + event.title + ' ' + event.event_starttime);
				this.$emit('popup-event', event.id);
			},
			doUrgentNeedClicked(need) {
				console.log('urgent need clicked: ' + need.title + ' ' + need.event_starttime);
				this.$emit('popup-urgent-need', need.id);
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

	.search-results {
		padding-bottom: 20px;
	}

	.service-options, .service-options option {
		font-size: 0.85em !important;
	}

	.collection .collection-item p {
		font-size: 0.85em !important;
		font-weight: 400;
	}
	.collection-item .title {
		font-size: 0.88em !important;
		font-weight: 600 !important;
		cursor: pointer;
	}
	.collection-item.event .time,
	.collection-item.need .time {
		font-size: 600;
	}

	.collection-item.event .event-date,
	.collection-item.need .event-date {
		display: inline-block;
		background-color: #23A1CB;
		color: #ffffff;
		position: absolute;
		left: 10px;
		padding: 6px 12px;
		border-radius: 5px;
	}
	.collection-item.need .event-date {
		background-color: orange;
	}
	.collection-item.need.urgent .event-date {
		background-color: red;
	}
	.collection-item.need .event-date .expiry {
		font-size: 0.75em;
	}
	.collection-item.event .event-date .month,
	.collection-item.need .event-date .units {
		font-size: 0.85em;
		text-align: center;
		display: block;
		color: #ffffff;
		font-weight: 400;
	}
	.collection-item.event .event-date .day-of,
	.collection-item.need .event-date .time-left {
		font-size: 1.45em;
		text-align: center;
		display: block;
		color: #ffffff;
		font-weight: 500;
	}
	.collection-item.event .host,
	.collection-item.need .host {
		opacity: 0.7;
	}

</style>