<template>
	<div id="provider" class="section event-container main-section">

	    <div class="container">

	    	<h5>Post An Event</h5>

	      	<div class="row">
		        <!-- image column -->
		        <div class="event-input col s12 m6 padding">
		        	<p class="s12">
		        		<strong class="subheading">Enter a new event</strong><br/>
		        		Use the form below to post an event
	        		</p>
		        	<form action="#">
		        		<div class="row pad-top">
							<div class="input-field col s12 m6">
	                    		<input id="name" type="text" class="validate" name="title" v-model="newEvent.title" />
	                    		<label for="name">Title</label>
	                  		</div>
	                  		<div class="input-field col s12 m6">
	                    		<input id="name" type="text" class="validate" name="event_url" v-model="newEvent.event_url" />
	                    		<label for="name">Website (optional)</label>
	                  		</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
	                    		<textarea id="description" v-model="newEvent.description" class="materialize-textarea"></textarea>
	                    		<label for="description">Description</label>
	                  		</div>
						</div>
						<div class="row">
							<div class="input-field col s6">
	              				<input type="date" name="startDate" class="datepicker" v-change="doStartDateChange" v-model="newEvent.startdate">
	              				<label for="startDate">Start Date</label>
	            			</div>
	            			<div class="input-field col s2">
								<select name="starthours" v-change="doStartHoursChange" v-model="newEvent.starttime.hours">
									<option v-for="hour in hoursArray" :value="hour">{{hour}}</option>
								</select>
								<label>Hour</label>
							</div>
							<div class="input-field col s2">
								<select name="startmins" v-change="doStartMinsChange" v-model="newEvent.starttime.mins">
									<option v-for="min in minsArray" :value="min">{{min}}</option>
								</select>
								<label>Mins</label>
							</div>
	            			<div class="input-field col s2">
								<select name="startmeridiem" v-change="doStartMeridiemChange" v-model="newEvent.starttime.meridiem">
									<option value="AM">AM</option>
									<option value="PM">PM</option>
								</select>
								<label>AM/PM</label>
							</div>
            			</div>
            			<div class="row">
							<div class="input-field col s6">
	              				<input type="date" name="endDate" class="datepicker" v-change="doEndDateChange" v-model="newEvent.enddate">
	              				<label for="endDate">End Date</label>
	            			</div>
	            			<div class="input-field col s2">
								<select name="endhour" v-change="doEndHoursChange" v-model="newEvent.endtime.hours">
									<option v-for="hour in hoursArray" :value="hour">{{hour}}</option>
								</select>
								<label>Hour</label>
							</div>
							<div class="input-field col s2">
								<select name="endmins" v-change="doEndMinsChange" v-model="newEvent.endtime.mins">
									<option v-for="min in minsArray" :value="min">{{min}}</option>
								</select>
								<label>Mins</label>
							</div>
	            			<div class="input-field col s2">
								<select name="endmeridiem" v-change="doEndMeridiemChange" v-model="newEvent.endtime.meridiem">
									<option value="AM">AM</option>
									<option value="PM">PM</option>
								</select>
								<label>AM/PM</label>
							</div>
            			</div>
            			<div class="row">
							<p class="col s12 underline">
								<strong>Event Location</strong>
							</p>
							<p class="col s12">
      							<input name="onlocation" type="radio" value="0" v-model="useLocations" id="venue1" />
      							<label for="venue1">Enter new event venue information</label>
    						</p>
    						<p class="col s12">
      							<input name="onlocation" type="radio" value="1" v-model="useLocations" id="venue2" />
      							<label for="venue2">Select one of your locations as venue</label>
    						</p>
    						<p  class="col s12 underline"><p>
            			</div>
            			<div v-show="useLocations == 1" class="row">
							<div class="input-field col s12">
								<select class="location-options" name="location" v-change="doLocationChange">
									<option value="" selected>Choose a location</option>
									<option v-for="loc in provider.locations" :value="loc.id" class="">{{loc.name}}</option>
								</select>
								<label for="location">Your Locations</label>
	            			</div>
            			</div>
            			<div v-show="useLocations == 0" class="row">
							<div class="input-field col s12 m8">
								<input type="text" id="address1" name="address1" v-model="newEvent.address1" class="validate">
								<label for="address1">Address</label>
							</div>
							<div class="input-field col s12 m4">
								<input type="text" id="address2" name="address2" v-model="newEvent.address2" class="validate">
								<label for="address2">Suite #</label>
							</div>
							<div class="input-field col s12 m5">
								<input type="text" id="city" name="city" v-model="newEvent.city" class="validate">
								<label for="city">City</label>
							</div>
							<div class="input-field col s12 m3">
								<select id="state" name="state" v-model="newEvent.state">
									<option value="TN">TN</option>
								</select>
								<label>State</label>
							</div>
							<div class="input-field col s12 m4">
								<input type="text" id="zip" name="zip" v-model="newEvent.zip" class="validate">
								<label for="zip">Zip</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
	              				<button :class="{disabled: disableSubmitEvent, btn: true, 'btn-lg': true, 'waves-effect': true, 'waves-light': true}" class="" type="submit" name="action" v-on:click.prevent="doSubmitEvent">Submit Event
	              				</button>
	            			</div>
						</div>
		        	</form>
		        </div>

		        <!-- details column -->
		        <div class="posted-events col s12 m6 padding">
					<div class="row">
						<p>
							<strong class="subheading">Your events</strong><br/>
							Here are your recently posted events <em>(limit 10)</em>
						</p>
						<p v-show="events.length < 1">
							<strong>You have no recent events posted</strong>
						</p>
		        	</div>
		        	<div class="row">
						<!-- List events here... -->
						<div v-for="event in events" class="col s12 event-card">
    						<!-- <h5 class="header">{{ event.title }}</h5> -->
							<div class="card horizontal">
								<div class="card-image">
									<img :class="{padded: !provider.avatar}" :src="getSelectedProviderAvatar">
								</div>
								<div class="card-stacked">
									<div class="card-content">
										<p class="header"><strong>{{ event.title }}</strong></p>
										<p v-if="event.event_starttime" class="text-large">
              								<strong>{{ event.event_month }} {{ event.event_day_of_month }}</strong> at <strong>{{ event.event_starttime }}</strong><br/>
            							</p>
            							<p class="text-small">{{ event.event_address1}} <span v-if="event.address2" class="text-small">, {{ event.event_address2}}</span>
            							</p>
							            <p v-if="event.city || event.state" class="text-small">
							              {{ event.event_city}} {{ event.event_state }} {{ event.event_zip }}
							            </p>
							            <br/>
							            <p v-if="event.description" class="text-small">{{ event.description }}</p>
									</div>
									<div class="card-action">
										<a v-if="event.event_url" :href="event.event_url" target="_blank">Visit Event Website</a>
										<a class="btn-floating tooltipped btn-large waves-effect waves-light red right" title="Delete Event" @click="doDeleteEvent(event.id)" data-position="bottom" data-tooltip="Delete Event"><i class="material-icons">delete</i></a>
									</div>
								</div>
							</div>
  						</div>

		        	</div>

		        </div><!-- /.details-input -->
	        </div><!-- /.row -->

        </div><!-- /.container -->

    </div><!-- /.section -->
</template>

<script>

	import { resourceTypes, eventBus } from './components/helpers'
  	import nhmservice from './gateways/nhmservice';
  	require('materialize-css/dist/js/materialize');

  	export default {
  		name: 'event',

  		data() {
  			return {
  				provider: { id: null, locations: [] },
  				newEvent: {
  					title: null,
  					event_url: null,
  					description: null,
  					startdate: null,
  					enddate: null,
  					starttime: {hours: 0, mins: 0, meridiem: 'AM'},
  					endtime: {hours: 0, mins: 0, meridiem: 'AM'},
  					isNewLocation: true,
  					location: null,
  					address1: null,
  					address2: null,
  					city: null,
  					state: 'TN',
  					zip: null,
  					event_type: 'general',
  					provider: null
  				},
  				useLocations: 0,
  				events: [],
  			};
  		},

  		props: {
  			id: {
  				type: String,
  				required: true
  			}
  		},

  		created() {
	      console.log('Events.vue created...');
	    },

	    mounted() {
	    	var self = this;

	    	$('select:not([multiple])').material_select();
	    	$('.tooltipped').tooltip({delay: 50});
	    	
	    	try {
	    		Materialize.updateTextFields();  
    		} catch(ex) {
    			window.location.href = window.location.protocol + '//' + window.location.host;
    		}
	    	
	    	$('.modal').modal();

	    	$('.datepicker').pickadate({
		    	selectMonths: true, // Creates a dropdown to control month
		        selectYears: 3, // Creates a dropdown of 3 years to control year
		        container: 'body',
		        closeOnSelect: true
		    });


	    	//fetch provider
	    	this.fetchProvider();

	    	//fetch Events
	    	this.fetchEvents();
	    },

	    updated() {
			$('select:not([multiple])').material_select();
			Materialize.updateTextFields();  
			$('.tooltipped').tooltip({delay: 50});
			//console.log("Events updated...");
		},

		computed: {
			minsArray: function() {
				var minutes = [];
				for(let i=0; i<60; i++) {
					minutes.push(i);
				}
				return minutes;
			},
			hoursArray: function() {
				var hours = [];
				for(let i=1; i<13; i++) {
					hours.push(i);
				}
				return hours;
			},
			isoStartTimeString: function() {
				//returns datetime as 'YYYY-MM-DDTHH:mm:ss.sssZ' ISO format
				if(!this.newEvent.startdate) {
					return '';
				}
				var startdate = new Date(this.newEvent.startdate + ' ' +
					this.newEvent.starttime.hours + ':' +
					this.newEvent.starttime.mins + ' ' +
					this.newEvent.starttime.meridiem + ' CST');

				return startdate.toISOString();
			},
			isoEndTimeString: function() {
				//returns datetime as 'YYYY-MM-DDTHH:mm:ss.sssZ' ISO format
				if(!this.newEvent.enddate) {
					return '';
				}
				var enddate = new Date(this.newEvent.enddate + ' ' +
					this.newEvent.endtime.hours + ':' +
					this.newEvent.endtime.mins + ' ' +
					this.newEvent.endtime.meridiem + ' CST');

				return enddate.toISOString();
			},
			disableSubmitEvent: function() {
				if(this.newEvent.title && this.newEvent.startdate &&
					this.newEvent.description) {
					//console.log('submit enabled!');
					return false;
					
				}
				//console.log('submit NOT enabled!');
				return true;
			},

			getSelectedProviderAvatar: function() {
		        if(this.provider && this.provider.avatar) {
		          return this.provider.avatar
		        }
		        return "/static/img/mhrc_logo.png";
		    }
		},

		methods: {

			fetchProvider: function() {
				if(!this.id) {
					console.log("Provider could NOT be fetched! " + this.id);
					return;
				}

				nhmservice.getProvider(this, this.id)
					.then((response) => {
						this.provider = response.data;
						console.log(this.provider);

						this.newEvent.provider = this.provider.id;

					}, (err) => {
						console.log('whoops...error...', err);
					});

			},

			fetchEvents: function() {
				if(!this.id) {
					console.log("Events could NOT be fetched! " + this.id);
					return;
				}
				console.log('...getting events...');
				nhmservice.getEvents(this, this.id)
					.then((response) => {
						this.events = response.data;
						console.log(this.events);
						console.log('...got events?');
					}, (err) => {
						console.log('whoops...error...', err);
					});
			},

			doStartDateChange: function(el) {
				var $start = $(el);
				this.newEvent.startdate = $start.val();
				//console.log('start date changed...', $start.val());
			},

			doEndDateChange: function(el) {
				var $end = $(el);
				this.newEvent.enddate = $end.val();
				//console.log('end date changed...', $end.val());
			},

			doLocationChange: function(el) {
				var $location = $(el);
				this.newEvent.location = $location.val();
				//console.log('location changed...', $location.val());
			},

			doStartHoursChange: function(el) {
				this.newEvent.starttime.hours = $(el).val();
			},
			doStartMinsChange: function(el) {
				this.newEvent.starttime.mins = $(el).val();
			},
			doStartMeridiemChange: function(el) {
				this.newEvent.starttime.meridiem = $(el).val();
			},

			doEndHoursChange: function(el) {
				this.newEvent.endtime.hours = $(el).val();
			},
			doEndMinsChange: function(el) {
				this.newEvent.endtime.mins = $(el).val();
			},
			doEndMeridiemChange: function(el) {
				this.newEvent.endtime.meridiem = $(el).val();
			},

			doSubmitEvent: function() {
				var event = Object.assign({}, this.newEvent);
				event.start_datetime = this.isoStartTimeString;
				event.end_datetime = this.isoEndTimeString;

				delete event.stardate;
				delete event.enddate;
				delete event.starttime;
				delete event.endtime;
				delete event.isNewLocation;

				nhmservice.createEvent(this, event)
					.then((response) => {
						console.log(response.data);
						this.fetchEvents();
						Materialize.toast('Your event has been posted successfully', 2000);

						//clear the old newEvent model
						this.newEvent = {
		  					title: null,
		  					event_url: null,
		  					description: null,
		  					startdate: null,
		  					enddate: null,
		  					starttime: {hours: 0, mins: 0, meridiem: 'AM'},
		  					endtime: {hours: 0, mins: 0, meridiem: 'AM'},
		  					isNewLocation: true,
		  					location: null,
		  					address1: null,
		  					address2: null,
		  					city: null,
		  					state: 'TN',
		  					zip: null,
		  					event_type: 'general',
		  					provider: null
		  				};
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast('Unable to post your event. Please try again.', 2000);
					});
			},

			doDeleteEvent: function(e_id) {
				nhmservice.deleteEvent(this, e_id)
					.then((response) => {
						console.log(response.data);
						Materialize.toast('Event was deleted!', 2000);
						this.fetchEvents();
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast('Unable to delete that event. Please try again.', 2000);
					});
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

	/* Event Container */
	.event-container {
		height: 100vh;
		padding-top: 80px;
	}

	.posted-events {
		border-left: 1px solid #999;
	}

	.event-card {
		float: none;
		margin-bottom: 20px;
	}

	.event-card .card .card-image {
		max-width: 33%;
	}

	/*  Generics  */
	.nhm-dark-blue {
		background-color: #282C35;
	}
	.nhm-blue {
		color: #23A1CB;
	}
	.nhm-bg-blue, .btn, .btn:hover {
		background-color: #23A1CB; 
	}
	label.active {
		color: #23A1CB !important;
	}
	input[type=text]:focus:not([readonly]),
	input[type=email]:focus:not([readonly]),
	input[type=password]:focus:not([readonly]) {
		border-bottom: 1px solid #23A1CB !important;
	}
	[type="checkbox"].filled-in:checked + label:after {
		border-color: #23A1CB;
		background-color: #23A1CB;
	}
	.padding {
		padding: 20px !important;
	}
	.pad-top {
		padding-top: 0.75rem;
	}
	.pad-bottom {
		padding-bottom: 0.95rem !important;
	}
	.underline {
		border-bottom: 1px solid #999;
	}
	.subheading {
		font-size: 1.25em;
	}
	.text-small {
		font-size: 0.75rem;
	}

</style>