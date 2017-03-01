<template>
	<div id="provider" class="section event-container main-section">

	    <div class="container">

	    	<h5>Post An Urgent Need</h5>

	      	<div class="row">
		        <!-- image column -->
		        <div class="event-input col s12 m6 padding">
		        	<p class="s12">
		        		<strong class="subheading">Enter an Urgent Need</strong><br/>
		        		Use the form below to post a need.  Ideally, this will be a resource you need 
		        		fulfilled within the next <strong>48 hours</strong>.  All urgent needs expire after being listed for 50 hours.
	        		</p>
		        	<form action="#">
		        		<div class="row pad-top">
							<div class="input-field col s12 m6">
	                    		<input id="name" type="text" class="validate" name="title" v-model="newNeed.title" />
	                    		<label for="name">Title</label>
	                  		</div>
	                  		<div class="input-field col s12 m6">
	                    		<input id="name" type="text" class="validate" name="event_url" v-model="newNeed.event_url" />
	                    		<label for="name">Website (optional)</label>
	                  		</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
	                    		<textarea id="description" v-model="newNeed.description" class="materialize-textarea"></textarea>
	                    		<label for="description">Description</label>
	                  		</div>
						</div>
						<!--
            			<div class="row">
							<div class="input-field col s6">
	              				<input type="date" name="endDate" class="datepicker" v-change="doEndDateChange" v-model="newNeed.enddate">
	              				<label for="endDate">End Date</label>
	            			</div>
	            			<div class="input-field col s2">
								<select name="endhour" v-change="doEndHoursChange" v-model="newNeed.endtime.hours">
									<option v-for="hour in hoursArray" :value="hour">{{hour}}</option>
								</select>
								<label>Hour</label>
							</div>
							<div class="input-field col s2">
								<select name="endmins" v-change="doEndMinsChange" v-model="newNeed.endtime.mins">
									<option v-for="min in minsArray" :value="min">{{min}}</option>
								</select>
								<label>Mins</label>
							</div>
	            			<div class="input-field col s2">
								<select name="endmeridiem" v-change="doEndMeridiemChange" v-model="newNeed.endtime.meridiem">
									<option value="AM">AM</option>
									<option value="PM">PM</option>
								</select>
								<label>AM/PM</label>
							</div>
            			</div>
            			-->
            			<div class="row">
							<p class="col s12 underline">
								<strong>Need Location</strong>
							</p>
							<p class="col s12">
      							<input name="onlocation" type="radio" value="0" v-model="useLocations" id="venue1" />
      							<label for="venue1">Enter the location where this is needed</label>
    						</p>
    						<p class="col s12">
      							<input name="onlocation" type="radio" value="1" v-model="useLocations" id="venue2" />
      							<label for="venue2">Select one of your locations instead</label>
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
								<input type="text" id="address1" name="address1" v-model="newNeed.address1" class="validate">
								<label for="address1">Address</label>
							</div>
							<div class="input-field col s12 m4">
								<input type="text" id="address2" name="address2" v-model="newNeed.address2" class="validate">
								<label for="address2">Suite #</label>
							</div>
							<div class="input-field col s12 m5">
								<input type="text" id="city" name="city" v-model="newNeed.city" class="validate">
								<label for="city">City</label>
							</div>
							<div class="input-field col s12 m3">
								<select id="state" name="state" v-model="newNeed.state">
									<option value="TN">TN</option>
								</select>
								<label>State</label>
							</div>
							<div class="input-field col s12 m4">
								<input type="text" id="zip" name="zip" v-model="newNeed.zip" class="validate">
								<label for="zip">Zip</label>
							</div>
						</div>
						<div class="row">
							<div class="input-field col s12">
	              				<button :class="{disabled: disableSubmitNeed, btn: true, 'btn-lg': true, 'waves-effect': true, 'waves-light': true}" class="" type="submit" name="action" v-on:click.prevent="doSubmitNeed">Submit Urgent Need
	              				</button>
	            			</div>
						</div>
		        	</form>
		        </div>

		        <!-- details column -->
		        <div class="posted-events col s12 m6 padding">
					<div class="row">
						<p>
							<strong class="subheading">Your urgent needs</strong><br/>
							Here are your current needs
						</p>
						<p v-show="needs.length < 1">
							<strong>You have no urgent needs posted</strong>
						</p>
		        	</div>
		        	<div class="row">
						<!-- List needs here... -->
						<div v-for="need in needs" class="col s12 event-card">
    						<!-- <h5 class="header">{{ event.title }}</h5> -->
							<div class="card horizontal">
								<div class="card-image">
									<div :class="{urgent: makeUrgentRed(need)}" class="event-date">
										<span class="time-left">{{need.time_left}}</span>
										<span class="units">{{need.time_left_units}}</span>
						      		</div>
								</div>
								<div class="card-stacked">
									<div class="card-content">
										<p class="header"><strong>{{ need.title }}</strong></p>
										<p v-if="need.event_starttime" class="text-large">
              								<strong>{{ need.event_month }} {{ need.event_day_of_month }}</strong> at <strong>{{ need.event_starttime }}</strong><br/>
            							</p>
            							<p class="text-small">{{ need.event_address1}} <span v-if="need.address2" class="text-small">, {{ need.event_address2}}</span>
            							</p>
							            <p v-if="need.city || need.state" class="text-small">
							              {{ need.event_city}} {{ need.event_state }} {{ need.event_zip }}
							            </p>
							            <br/>
							            <p v-if="need.description" class="text-small">{{ need.description }}</p>
									</div>
									<div class="card-action">
										<a v-if="need.event_url" :href="need.event_url" target="_blank">Visit Website</a>
										<a class="btn-floating tooltipped btn-large waves-effect waves-light red right" title="Delete This Need" @click="doDeleteNeed(need.id)" data-position="bottom" data-tooltip="Delete this Need"><i class="material-icons">delete</i></a>
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

	import { resourceTypes, eventBus } from './main'
  	import nhmservice from './gateways/nhmservice';
  	require('materialize-css/dist/js/materialize');

  	export default {
  		name: 'urgent-need',

  		data() {
  			return {
  				provider: { id: null, locations: [] },
  				newNeed: {
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
  					event_type: 'urgent_need',
  					provider: null
  				},
  				useLocations: 0,
  				needs: [],
  			};
  		},

  		props: {
  			id: {
  				type: String,
  				required: true
  			}
  		},

  		created() {
	      console.log('UrgentNeeds.vue created...');
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
	    	this.fetchNeeds();
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
				if(!this.newNeed.startdate) {
					return '';
				}
				var startdate = new Date(this.newNeed.startdate + ' ' +
					this.newNeed.starttime.hours + ':' +
					this.newNeed.starttime.mins + ' ' +
					this.newNeed.starttime.meridiem + ' CST');

				return startdate.toISOString();
			},
			isoEndTimeString: function() {
				//returns datetime as 'YYYY-MM-DDTHH:mm:ss.sssZ' ISO format
				if(!this.newNeed.enddate) {
					return '';
				}
				var enddate = new Date(this.newNeed.enddate + ' ' +
					this.newNeed.endtime.hours + ':' +
					this.newNeed.endtime.mins + ' ' +
					this.newNeed.endtime.meridiem + ' CST');

				return enddate.toISOString();
			},
			disableSubmitNeed: function() {
				if(this.newNeed.title && this.newNeed.description) {
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

						this.newNeed.provider = this.provider.id;

					}, (err) => {
						console.log('whoops...error...', err);
					});

			},

			fetchNeeds: function() {
				if(!this.id) {
					console.log("Needs could NOT be fetched! " + this.id);
					return;
				}
				console.log('...getting needs...');
				nhmservice.getNeeds(this, this.id)
					.then((response) => {
						this.needs = response.data;
						console.log(this.needs);
						console.log('...got needs?');
					}, (err) => {
						console.log('whoops...error...', err);
					});
			},

			makeUrgentRed: function(need) {
				if(need && need.time_left_units === 'hours' && need.time_left < 12) {
					return true;
				}
				return false;
			},

			doStartDateChange: function(el) {
				var $start = $(el);
				this.newNeed.startdate = $start.val();
				//console.log('start date changed...', $start.val());
			},

			doEndDateChange: function(el) {
				var $end = $(el);
				this.newNeed.enddate = $end.val();
				//console.log('end date changed...', $end.val());
			},

			doLocationChange: function(el) {
				var $location = $(el);
				this.newNeed.location = $location.val();
				//console.log('location changed...', $location.val());
			},

			doStartHoursChange: function(el) {
				this.newNeed.starttime.hours = $(el).val();
			},
			doStartMinsChange: function(el) {
				this.newNeed.starttime.mins = $(el).val();
			},
			doStartMeridiemChange: function(el) {
				this.newNeed.starttime.meridiem = $(el).val();
			},

			doEndHoursChange: function(el) {
				this.newNeed.endtime.hours = $(el).val();
			},
			doEndMinsChange: function(el) {
				this.newNeed.endtime.mins = $(el).val();
			},
			doEndMeridiemChange: function(el) {
				this.newNeed.endtime.meridiem = $(el).val();
			},

			doSubmitNeed: function() {
				var need = Object.assign({}, this.newNeed);
				need.start_datetime = (new Date()).toISOString();
				//need.end_datetime = this.isoEndTimeString;

				delete need.stardate;
				delete need.enddate;
				delete need.starttime;
				delete need.endtime;
				delete need.isNewLocation;

				nhmservice.createNeed(this, need)
					.then((response) => {
						console.log(response.data);
						this.fetchNeeds();
						Materialize.toast('Your need has been posted successfully', 2000);

						//clear the old newEvent model
						this.newNeed = {
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
		  					event_type: 'urgent_need',
		  					provider: null
		  				};
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast('Unable to post your need. Please try again.', 2000);
					});
			},

			doDeleteNeed: function(e_id) {
				nhmservice.deleteNeed(this, e_id)
					.then((response) => {
						console.log(response.data);
						Materialize.toast('Urgent Need was deleted!', 2000);
						this.fetchNeeds();
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast('Unable to delete that need. Please try again.', 2000);
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
		padding: 10px;
	}

	.card .card-content {
		padding-top: 10px;
		padding-left: 60px;
	}

	.card-image .event-date.urgent {
		background-color: red;
	}

	.event-date {
		display: inline-block;
		/* background-color: #23A1CB; */
		color: #ffffff;
		position: absolute;
		left: 10px;
		padding: 6px 12px;
		border-radius: 5px;
		background-color: orange;
	}
	.event-date .expiry {
		font-size: 0.75em;
	}
	.event-date .month,
	.event-date .units {
		font-size: 0.85em;
		text-align: center;
		display: block;
		color: #ffffff;
		font-weight: 400;
	}
	.event-date .day-of,
	.event-date .time-left {
		font-size: 1.45em;
		text-align: center;
		display: block;
		color: #ffffff;
		font-weight: 500;
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