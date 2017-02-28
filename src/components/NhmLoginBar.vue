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
		              <input id="email" type="email" v-model="signin.email" class="validate">
		              <label for="email">Email</label>
		            </div>
		          </div>
		          <div class="row">
		            <div class="input-field col s12">
		              <input id="password" type="password" v-model="signin.pass" class="validate">
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
					<p align="center"><strong>{{ provider.name }}</strong></p>
					<small @click="test">Welcome!</small>
					<div class="collection">
				        <router-link to="/" 
				        	class="collection-item nhm-blue"
				        	@click.native="doRouteClicked('home')">Home</router-link> <!-- add .active -->
				        <router-link to="/events" class="collection-item nhm-blue"
				        	@click.native="doRouteClicked('events')">Manage Events</router-link>
				        <router-link to="/urgent-needs" class="collection-item nhm-blue"
				        	@click.native="doRouteClicked('urgentneeds')">Manage Urgent Needs</router-link>
				        <router-link :to="accountRoute" class="collection-item nhm-blue"
				        	@click.native="doRouteClicked('account')">Account</router-link>
				        <router-link to="/faq" class="collection-item nhm-blue"
				        	@click.native="doRouteClicked('faq')">F. A. Q.</router-link>
				        <a href="#" class="collection-item nhm-blue" @click="doProviderSignOut">Sign Out</a>
      				</div>
				</div>
			</div>
	    </div>
  	</section>

</template>


<script>
	import { eventBus } from '../main';
	import nhmservice from '../gateways/nhmservice';
	require('materialize-css/dist/js/materialize');

	const NHMTOKEN = 'nhmtoken';
	const NHMPROVIDERID = 'nhmproviderid';

	export default {
		name: 'nhm-login-bar',

		data() {
			return {
				key: null,
				provider: { id: null },
				signin: {
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
			this.key = window.localStorage.getItem(NHMTOKEN);
			this.provider.id = window.localStorage.getItem(NHMPROVIDERID);

			this.$http.headers.common['Authorization'] = 'Token ' + this.key;

			if(this.provider.id) {
				this.$emit('provider-authenticated', this.provider.id);
			}
			/*
			eventBus.$on('show-login-bar', function(){
				console.log('bus: received show-login-bar event. Showing...');
				$('.login-panel-trigger').sideNav();
			});
			*/
		},

		beforeDestroy() {
			//window.localStorage.removeItem(NHMTOKEN);
		},

		computed: {
			enableSendRequest: function() {
				return this.registration.organization && 
					this.registration.email && this.registration.phone;
			},
			enableSignIn: function() {
				return this.signin.email && this.signin.pass;
			},
			accountRoute: function() {
				return '/account/' + this.provider.id;
			}
		},

		methods: {
			test: function() {
				console.log('testing router...');
				//this.$router.push('/');
			},
			showPanel: function(param) {

			},
			doRouteClicked: function(name) {
				//console.log('start event...route-clicked...')
				this.$emit('route-clicked', name);
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
				nhmservice.login(this, {username: this.signin.email, password: this.signin.pass})
					.then((resp) => {
						console.log(resp, resp.data.token);
						this.key = resp.data.token;
						console.log(this.key);
						if(this.key) {
							this.$http.headers.common['Authorization'] = 'Token ' + this.key;
							window.localStorage.setItem(NHMTOKEN, this.key);
							this.provider = {
								user_id: resp.data.user_id,
								id: resp.data.provider_id,
								name: resp.data.provider_name
							};
							window.localStorage.setItem(NHMPROVIDERID, this.provider.id);
							console.log(this.provider);
							this.signin.pass = null;
							this.$emit('provider-authenticated', this.provider.id);
						}

						/*
						nhmService.getProvider(this,
									{ username: this.signin.email, password: this.signin.pass})
							.then((data) => {
								console.log(data);
								this.provider = data.provider;
							}).error((err) => {
								console.log(err);
								Materialize.toast('Failed to retrieve Provider account', 3000);
							});
						*/

						// Redirect to a specified route
						//if(redirect) {
							//router.go(redirect)        
						//}

					}, (err) => {
						console.log(err);
						Materialize.toast('Login failed. Make sure your credentials are correct', 3000);
					});
			},
			doProviderSignOut: function() {
				window.localStorage.removeItem(NHMTOKEN);
				window.localStorage.removeItem(NHMPROVIDERID);
				this.$http.headers.common['Authorization'] = '';
				this.key = null;

				//redirect to the map page
				this.$router.push('/');
				this.doRouteClicked('home');
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