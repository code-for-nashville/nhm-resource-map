<template>
	<div id="provider" class="section account-container main-section">

	    <div class="container">

	      <h5>Provider Account Details</h5>

	      <div class="row">
	        <!-- logo column -->
	        <div class="logo-input col s4 m3">
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
	        </div>

	        <!-- details column -->
	        <div class="details-input col s8 m9">

	          <div class="row">
	            <div class="col s12">
	              <ul class="tabs">
	                <li class="tab col s4"><a class="cyan-text text-darken-1" href="#contact">Contact Information</a></li>
	                <li class="tab col s4"><a class="cyan-text text-darken-1" href="#services">Services</a></li>
	                <li class="tab col s4"><a class="cyan-text text-darken-1" href="#locations">Locations</a></li>
	              </ul>
	            </div>
	            <!-- Contact Info -->
	            <div id="contact" class="col s12">
	              <form action="#">
	                <div class="row pad-top">
	                  <div class="input-field col s12 m8">
	                    <input id="name" type="text" class="validate" name="name" v-model="provider.name" />
	                    <label for="name">Organization Name</label>
	                  </div>
	                  <div class="input-field col s12 m4">
	                    <select v-model="provider.org_type" name="org_type">
	                      <option value="">Select Type</option>
	                      <option value="community">Community</option>
	                      <option value="government">Government</option>
	                      <option value="nonprofit">Non-Profit</option>
	                      <option value="volunteer">Volunteer</option>
	                    </select>
	                    <label>Organization Type</label>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="input-field col s12 m6">
	                    <input id="phone" type="text" class="validate" v-model="provider.phone" name="phone">
	                    <label for="phone">Phone</label>
	                  </div>
	                  <div class="input-field col s12 m6">
	                    <input id="email" type="email" class="validate" v-model="provider.email" name="email" disabled>
	                    <label for="email">Email</label>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="input-field col s12">
	                    <textarea id="description" v-model="provider.description" class="materialize-textarea"></textarea>
	                    <label for="description">Description</label>
	                  </div>
	                </div>
	                <div class="row">
	                  <div class="input-field col s12 m4">
	                    <input id="website" type="url" v-model="provider.website" class="validate" name="website">
	                    <label for="website">Website</label>
	                  </div>
	                  <div class="input-field col s12 m4">
	                    <input id="facebook" type="text" v-model="provider.facebook" class="validate" name="facebook">
	                    <label for="facebook">Facebook</label>
	                  </div>
	                  <div class="input-field col s12 m4">
	                    <input id="twitter" type="text" v-model="provider.twitter" class="validate" name="twitter">
	                    <label for="twitter">Twitter</label>
	                  </div>
	                  <div class="input-field col s12">
	                    <button class="btn waves-effect waves-light right" 
	                    		type="submit" @click.prevent="updateProvider" name="action">Save Information
	                      <i class="material-icons right">input</i>
	                    </button>
	                  </div>
	                </div>
	              </form>
	            </div>

	            <!-- Services -->
	            <div id="services" class="col s12 pad-bottom">
	              <form action="#">
	                <div class="row pad-top">
	                  <p v-for="service in services" class="col s12 m6">
	                    <input type="checkbox" class="filled-in" :id="'srvc_'+service.id"
	                    	name="services" :value="service.id" v-model="providerServices" />
	                    <label :for="'srvc_'+service.id">{{ service.name }}</label>
	                  </p>
	                </div>
	                <div class="input-field col s12">
	                  <button class="btn waves-effect waves-light right" 
	                  			@click.prevent="updateProviderServices" type="submit" 
	                  			name="action">Save Services
	                    <i class="material-icons right">input</i>
	                  </button>
	                </div>
	              </form>
	            </div>

	            <!-- Locations -->
	            <div id="locations" class="col s12">
	              <div class="row pad-top">
	                <div class="col s12">
	                  <form action="#" id="add-new-location-form z-depth-2">
	                    <div class="row">

	                      <div class="input-field col s12">
	                        <input type="text" id="name" name="name" v-model="newLocation.name" class="validate">
	                        <label for="name">Location Name</label>
	                      </div>
	                      <div class="input-field col s12 m8">
	                        <input type="text" id="address1" name="address1" v-model="newLocation.address1" class="validate">
	                        <label for="address1">Address</label>
	                      </div>
	                      <div class="input-field col s12 m4">
	                        <input type="text" id="address2" name="address2" v-model="newLocation.address2" class="validate">
	                        <label for="address2">Suite #</label>
	                      </div>
	                      <div class="input-field col s12 m5">
	                        <input type="text" id="city" name="city" v-model="newLocation.city" class="validate">
	                        <label for="city">City</label>
	                      </div>
	                      <div class="input-field col s12 m3">
	                        <select id="state" name="state" v-model="newLocation.state">
	                          <option value="TN">Tennessee</option>
	                        </select>
	                        <label>State</label>
	                      </div>
	                      <div class="input-field col s12 m4">
	                        <input type="text" id="zip" name="zip" v-model="newLocation.zip" class="validate">
	                        <label for="zip">Zip</label>
	                      </div>
	                      <div class="input-field col s12">
	                        <button v-if="enableAddLocation" class="btn waves-effect waves-light center" type="submit" name="action" @click="addProviderLocation">Add Location
	                        </button>
	                        <button v-else class="btn waves-effect waves-light center" type="submit" name="action" disabled>Add Location
	                        </button>
	                        <button class="btn grey center" type="reset" name="action">Clear
	                        </button>&nbsp;&nbsp;
	                      </div>
	                    </div>
	                  </form>
	                </div>
	                <div class="col s12">

		                <div class="row pad-top">
		                    <hr/>
		                    <h5>Your Locations</h5>

		                    <div class="col s12">
		                    
		                      <div v-for="location in provider.locations" class="card nhm-bg-blue location-card">
		                        <div class="card-content white-text">
		                          <div class="card-title">{{ location.name }}
		                            <i class="large material-icons left">location_on</i>
		                          </div>
		                          <div>
		                            <nobr>{{ location.address1 }}</nobr><br/>
		                            <nobr>{{ location.city }}, {{ location.state }} {{ location.zip }}</nobr>
		                          </div>
		                        </div>
		                        <div class="card-action">
		                          <a href="#" class="right white-text" @click="doMarkForDeletion(location)">
		                          Delete
		                          <i class="material-icons right">location_off</i>
		                          </a><br/>
		                        </div>
		                      </div>

		                    </div>
		                </div>

	                </div> <!-- /.col.s12 -->
	              </div>
	            </div><!-- /.row.pad-top -->

	          </div>

	        </div><!-- /.details-input -->
	      
	    </div> <!-- /.container -->

	    <!-- Location Delete Modal Structure -->
		<div id="deleteLocationModal" class="modal">
		    <div class="modal-content">
		      <h4>Delete Location?</h4>
		      <p align="center">Are you sure you want to delete this location, <strong>{{ deleteLocation.name }}</strong>?</p>
		    </div>
		    <div class="modal-footer">
		      <a class=" modal-action modal-close waves-effect waves-red btn-flat" @click.prevent="doDeleteLocation">Yes</a>
		      <a class=" modal-action modal-close waves-effect waves-green btn-flat">Cancel</a>
		    </div>
		</div>

		<!-- Location Delete Modal Structure -->
		<div id="deleteLogoModal" class="modal">
		    <div class="modal-content">
		      <h4>Delete Logo?</h4>
		      <p align="center">Are you sure you want to delete your logo?</strong>?</p>
		    </div>
		    <div class="modal-footer">
		      <a class=" modal-action modal-close waves-effect waves-red btn-flat" @click.prevent="doDeleteLogo">Yes, Delete It!</a>
		      <a class=" modal-action modal-close waves-effect waves-green btn-flat">Cancel</a>
		    </div>
		</div>

	</div>
</template>

<script>
	import { resourceTypes, eventBus } from './main'
  	import nhmservice from './gateways/nhmservice';
  	require('materialize-css/dist/js/materialize');

  	export default {
  		name: 'provider',

  		data() {
  			return {
  				provider: { id: null, services: [], locations: [] },
  				fileUploadFormData: new FormData(),
  				newLocation: {
  					name: null,
  					address1: null,
  					address2: null,
  					city: null,
  					state: 'TN',
  					zip: null
  				},
  				deleteLocation: {},
  				services: [],
  				providerServices: [],
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

	    	$('select[name="org_type"]').on('change', function(ev){
	    		var $select = $(this),
	    			org_type = $select.val();

	    		self.provider['org_type'] = org_type;
	    		//console.log(org_type);
	    	});

	    	$('#form-logo-upload input[type="file"]').on('change', function(ev){
	    		var $file = $(this),
	    			$form = $('#form-logo-upload');

	    		console.log("file upload...", $file);

	    		self.fileUploadFormData.append('logo_file', $file[0].files[0] /* ev.target.files[0] */);
	    		self.fileUploadFormData.append('provider_id', self.provider.id);
	    		self.fileUploadFormData.append('action', 'xnLogoUpload');

	    		self.doFileUpload();
	    	})

	    	//register to be notified when services are loaded
	    	eventBus.$on('services-loaded', function(services) {
	    		this.services = services || [];
	    		//console.log('Provider received services: ', this.services);
	    	});

	    	//fetch Services
	    	this.fetchServices();

	    	//fetch provider
	    	this.fetchProvider();
	    },

	    updated() {
			$('select:not([multiple])').material_select();
			Materialize.updateTextFields();  
			console.log("Provider updated...");
		},

		computed: {
			enableAddLocation: function() {
				if(this.newLocation.name && 
					this.newLocation.address1 && 
					this.newLocation.city && 
					this.newLocation.zip) {
					return true;
				}
				return false;
			}
		},

		methods: {

			fetchServices: function() {
				nhmservice.getServices(this).then((response) => {
			        this.services = response.data;
			        //this.$set(this.services, response.data);
			        //console.log('got data...', this.services);
			        eventBus.$emit('services-loaded', this.services);

			      }, (err) => {
			        //context.error = err;
			        console.log('whoops...error...', err);
			      });
			},

			fetchProvider: function() {
				if(!this.id) {
					console.log("Provider could NOT be fetched! " + this.id);
					return;
				}

				nhmservice.getProvider(this, this.id)
					.then((response) => {
						this.provider = response.data;
						console.log(this.provider);

						this.providerServices = this.provider.services.map(function(item, idx) {
				        	return item.id;
				        });
				        console.log('providerServices -->', this.providerServices);

					}, (err) => {
						console.log('whoops...error...', err);
					});

			},

			updateProvider: function() {
				if(!this.id) {
					console.log("NO Provider to update! " + this.id);
					return;
				}

				nhmservice.updateProvider(this, this.provider)
					.then((response) => {
						console.log(response);
						this.provider = response.data;
						Materialize.toast("Your information has been updated!", 2000);
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast("Unable to update your information. Please try again.", 2000);
					});

			}, 

			updateProviderServices: function() {
				//var self = this;

				if(!this.id) {
					console.log("NO Provider to update! " + this.id);
					return;
				}

				this.provider.services = this.services.filter(function(item, idx) {
		        	if(this.providerServices.indexOf(item.id) !== -1) {
		        		return true;
		        	}
		        	return false;
		        }.bind(this));

		        this.provider.services = this.provider.services.map(function(item, idx) {
		        	// only retain the required fields of the service items
		        	return {
		        		id: item.id,
		        		name: item.name
		        	};
		        }.bind(this));

		        console.log('provider services -->', this.provider.services);

				nhmservice.updateProviderServices(this, {id: this.provider.id, services: this.provider.services})
					.then((response) => {
						console.log(response);
						this.provider = response.data;
						Materialize.toast("Your services have been updated!", 2000);
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast("Unable to update your services. Please try again.", 2000);
					});
			},

			addProviderLocation: function() {
				// use this.provider.id and this.newLocation
				let location = Object.assign({}, this.newLocation);
				//this.provider.locations.push(location);
				this.newLocation = {
  					name: null,
  					address1: null,
  					address2: null,
  					city: null,
  					state: 'TN',
  					zip: null
  				};

  				//console.log('provider location -->', this.provider.locations)

  				nhmservice.addProviderLocation(this, {id: this.provider.id, location: location})
					.then((response) => {
						console.log(response);
						this.provider = response.data;
						Materialize.toast("Your locations have been updated!", 2000);
						console.log(this.provider.locations);
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast("Unable to update your locations. Please try again.", 2000);
					});

			},

			doMarkForDeletion: function(location) {
				this.deleteLocation = location;
				$('#deleteLocationModal').modal('open');
				console.log("you want to delete this location?: ", location.id);
			},

			doDeleteLocation: function() {
				nhmservice.deleteLocation(this, {id: this.provider.id, location: this.deleteLocation})
					.then((response) => {
						console.log(response);
						this.provider = response.data;
						Materialize.toast("Your location has been deleted!", 2000);
						console.log(this.provider.locations);
						console.log("delete location: ", this.deleteLocation.id);
						this.deleteLocation = {};
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast("Unable to delete that location. Please try again.", 2000);
					});
			},

			doFileUpload: function() {
				Materialize.toast("Logo uploaded started...", 3000);
				nhmservice.uploadMediaFile(this, this.provider.id, this.fileUploadFormData)
					.then((response) => {
						console.log("logo upload ended...", response);
						this.provider = response.data;
						//Materialize.toast("Logo uploaded successfully!", 2000);
						
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast("Unable to upload your logo! Please try again.", 2000);
					});
			},

			startDeleteLogo: function(location) {
				$('#deleteLogoModal').modal('open');
				console.log("you want to delete logo?: ", provider.id);
			},

			doDeleteLogo: function() {
				nhmservice.deleteLogo(this, this.provider.id)
					.then((response) => {
						console.log(response);
						this.provider = response.data;
						Materialize.toast("Logo was deleted!", 2000);
					}, (err) => {
						console.log('whoops...error...', err);
						Materialize.toast("Unable to delete your logo. Please try again.", 2000);
					});
			}

		}
  	}

</script>

<style scoped>

	/* Account Container */
	.account-container {
		height: 100vh;
		padding-top: 80px;
	}

	.icon-block {
		padding: 0 15px;
	}
	.icon-block .material-icons {
		font-size: inherit;
	}

	.card.horizontal {
		margin-top: 0px;
		margin-bottom: 0px;
	}
	.card-image img.padded {
		padding-top: 24px;
		padding-left: 14px;
	}

	.card .card-content .card-title i.material-icons {
		line-height: normal;
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

	/* Logo Holding Column */
	.logo-wrapper {
		width: 100%;
	}
	.logo-wrapper img {
		padding: 4px;
		width: 100%;
		height: auto;
		border-bottom: 1px solid #bbb;
	}
	.logo-provider-name {
		text-align: center;
		font-weight: 500;
		color: #888;
		margin-top: 10px;
	}
	@media screen and (min-width: 767px) {
		.logo-provider-name {
			/* margin-top: 50px; 
			margin-top: 0px; */
		}
		.logo-controls .file-field .btn {
			float: none !important;
			font-size: 0.65rem;
		}
	}
	.logo-controls {
		text-align: center;
	}
	.logo-controls .file-field {
		text-align:center;
	}
	.logo-controls .file-field .btn {
		float: none !important;
		font-size: 0.80rem;
	}

</style>