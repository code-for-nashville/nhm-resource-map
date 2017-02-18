<template>

	<section id="login-panel" class="side-nav side-panel"><!-- id=nav-mobile -->
	    <div class="center side-panel-logo">
	      <img src="../assets/img/mhrc_logo.png" />
	    </div>
	    <h5 class="center">Provider Access</h5>
	    <div v-show="!key" class="login-form-wrapper">
		    <div v-show="!showRegistration" class="row">
		        <form class="col s12">
		          <div class="row">
		            <div class="input-field col s12">
		              <input id="email" type="email" v-model="provider.email" class="validate">
		              <label for="email">Email</label>
		            </div>
		          </div>
		          <div class="row">
		            <div class="input-field col s12">
		              <input id="password" type="password" v-model="provider.pass" class="validate">
		              <label for="password">Password</label>
		            </div>
		          </div>
		          <div class="row">
		            <div class="input-field col s12">
		              <button v-if="enableSignIn" class="btn waves-effect waves-light right" 
		              type="submit" name="action" @click.prevent="doProviderSignIn">Sign In
		                <i class="material-icons right">send</i>
		              </button>
		              <button v-else disabled class="btn waves-effect waves-light right" 
		              type="submit" name="action" @click.prevent="doProviderSignIn">Sign In
		                <i class="material-icons right">send</i>
		              </button>
		            </div>
		          </div>
		          <div class="row">
		            <div class="toggle-btn col s12">
		              <a class="btn-flat inline-block text-small text-center" @click.prevent="doToggleLoginForm">No Account? Request&nbsp;Access!</a>
		            </div>
		          </div>
		        </form>
		    </div>

		    <div v-show="showRegistration" class="row">
		        <form class="col s12">
		        	<div class="row">
			            <div class="input-field col s12">
			              	<input id="name" type="text" v-model="registration.organization" class="validate">
			              	<label for="name">Organization Name</label>
			            </div>
			        </div>
			        <div class="row">
			            <div class="input-field col s12">
			            	<input id="email" type="email" v-model="registration.email" class="validate">
			            	<label for="email">Email</label>
			            </div>
			        </div>
			        <div class="row">
			            <div class="input-field col s12">
			            	<input id="phone" type="text" v-model="registration.phone" class="validate">
			            	<label for="phone">Phone Number</label>
			            </div>
			        </div>
			        <div class="row">
			            <div class="input-field col s12">
			            	<button v-if="enableSendRequest" class="btn waves-effect waves-light right" 
			            	type="submit" name="action" @click.prevent="doSendProviderRequest">Send Request
			                	<i class="material-icons right">send</i>
			              	</button>
			              	<button v-else disabled class="btn waves-effect waves-light right" 
			            	type="submit" name="action" @click.prevent="doSendProviderRequest">Send Request
			                	<i class="material-icons right">send</i>
			              	</button>
			            </div>
			        </div>
			        <div class="row">
			            <div class="toggle-btn col s12">
			              	<a class="btn-flat inline-block text-small text-center" @click.prevent="doToggleLoginForm">Provider? Sign In!</a>
			            </div>
			        </div>
		        </form>
		    </div>
	    </div>
	    <div v-show="!!key" class="account-menu">
			<div class="row">
				<div class="col s12">
					<h5>Yay! Provider is logged in.</h5>
				</div>
			</div>
	    </div>
  	</section>

</template>


<script>
	import { eventBus } from '../main';
	import nhmservice from '../gateways/nhmservice';
	require('materialize-css/dist/js/materialize');

	export default {
		name: 'nhm-login-bar',

		data() {
			return {
				key: null,
				provider: {
					email: null,
					pass: null
				},
				registration: {
					organization: null,
					email: null,
					phone: null
				},
				showRegistration: false
			};
		},

		mounted() {
			/*
			eventBus.$on('show-login-bar', function(){
				console.log('bus: received show-login-bar event. Showing...');
				$('.login-panel-trigger').sideNav();
			});
			*/
		},

		computed: {
			enableSendRequest: function() {
				return this.registration.organization && 
					this.registration.email && this.registration.phone;
			},
			enableSignIn: function() {
				return this.provider.email && this.provider.pass;
			}
		},

		methods: {
			showPanel: function(param) {

			},
			doToggleLoginForm: function() {
				this.showRegistration = !this.showRegistration;
			},
			doSendProviderRequest: function() {
				nhmservice.providerRequestAccess(this, 
					{ organization: this.registration.organization,
						email: this.registration.email,
						phone: this.registration.phone})
					.then((response) => {
						var res = response.data;
						console.log('registration: ', response);
						Materialize.toast('Your request has been received and will be processed soon.', 3000);
						//this.$set(this.services, response.data);
						//console.log('got data...', this.services);

					}, (err) => {
						//context.error = err;
						console.log('whoops...error...', err);
						Materialize.toast('Sorry, an error occurred. Try again later!', 3000);
					});
			},
			doProviderSignIn: function() {

			}
		}
	}

</script>


<style scoped>

	.side-panel {
		padding:20px;
		color: #676767;
	}
	.side-panel-logo img {
		max-width: 90px;
		height: auto;
	}

	.text-small {
		font-size: 0.75em;
		color: #777;
	}
	.inline-block {
		display: inline-block;
	}
	.login-form-wrapper .btn-flat {
		width: 100%;
	}
	.toggle-btn {
		text-align: center;
		padding-left: 0px !important;
	}
	.toggle-btn a {
		color: #888 !important;
		padding: 0px 10px 0px 0px !important;
	}

</style>