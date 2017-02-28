<template>
	<div id="provider" class="section event-container main-section">

	    <div class="container">

	    	<h5>Post An Event</h5>

	      	<div class="row">
		        <!-- image column -->
		        <div class="event-input col s12 m6">
		        	<div class="row">
						<p><strong>Enter a new event</strong></p>
		        	</div>
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
		        	</form>
		        	<!--
		        	<div class="logo-wrapper">
						<img v-if="provider.avatar" :src="provider.avatar" class="provider-logo"/>
						<img v-else src="./assets/img/placeholder.png" title="Upload Logo" class="provider-logo"/>
		        	</div>
		        	<div class="logo-controls">
						<a v-if="provider.avatar" class="waves-effect waves-light btn red" :data-provider-id="provider.id" @click="startDeleteLogo">Delete Logo</a>
						<form v-else action="#" id="form-logo-upload">
							<div class="file-field input-field">
								<div class="btn btn-small small">
									<span>Upload&nbsp;Logo</span>
									<input type="file" id="logo-file" name="logo_file">
									<input type="hidden" id="logo-provider-id" :value="provider.id" name="provider_id" />
									<input type="hidden" value="xnLogoUpload" name="action"/>
								</div>
								<div class="file-path-wrapper" style="height:1px;">
									<input class="file-path validate" type="text">
								</div>
							</div>
						</form>
		        	</div>
		        	<p class="logo-provider-name">{{provider.name}}</p>
		        	-->
		        </div>

		        <!-- details column -->
		        <div class="posted-events col s12 m6">
					<div class="row">
						<p>
							<strong>Your events</strong><br/>
							Here are your recently posted events <em>(limit 10)</em>
						</p>
		        	</div>
		        	<div class="row">
						<!-- List events here... -->
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
  					starttime: null,
  					endtime: null,
  					isNewLocation: true,
  					location: null,
  					address1: null,
  					address2: null,
  					city: null,
  					state: 'TN',
  					zip: null,
  					event_type: 'general',
  					provider: null
  				}
  			};
  		},

  		props: {
  			id: {
  				type: String,
  				required: true
  			}
  		},

  		created() {
	      console.log('Provider.vue created...');
	    },

	    mounted() {
	    	var self = this;

	    	$('select:not([multiple])').material_select();
	    	$('ul.tabs').tabs();
	    	
	    	try {
	    		Materialize.updateTextFields();  
    		} catch(ex) {
    			window.location.href = window.location.protocol + '//' + window.location.host;
    		}
	    	
	    	$('.modal').modal();



	    	//fetch provider
	    	this.fetchProvider();
	    },

	    updated() {
			$('select:not([multiple])').material_select();
			Materialize.updateTextFields();  
			console.log("Events updated...");
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

						this.newEvent.provider = {
							id: this.provider.id,
							name: this.provider.name
						};

						/*
						this.providerServices = this.provider.services.map(function(item, idx) {
				        	return item.id;
				        });
				        console.log('providerServices -->', this.providerServices);
				        */

					}, (err) => {
						console.log('whoops...error...', err);
					});

			},

		}

	}

</script>

<style scoped>

	/* Event Container */
	.event-container {
		height: 100vh;
		padding-top: 80px;
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
		padding: 20px;
	}
	.pad-top {
		padding-top: 0.75rem;
	}
	.pad-bottom {
		padding-bottom: 0.95rem !important;
	}

</style>