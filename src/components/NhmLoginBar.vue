<template>

	<section id="login-panel" class="side-nav side-panel"><!-- id=nav-mobile -->
	    <div class="center side-panel-logo">
	      <img src="../assets/img/mhrc_logo.png" />
	    </div>
	    <h5 class="center">Provider Access</h5>
	    <div v-show="!key" class="login-form-wrapper">
	      <div class="row">
	        <form class="col s12">
	          <div class="row">
	            <div class="input-field col s12">
	              <input id="email" type="email" v-model="provider.email" class="validate">
	              <label for="email">Email</label>
	            </div>
	          </div>
	          <div class="row">
	            <div class="input-field col s12">
	              <input id="password" type="password" v-model="provider.password" class="validate">
	              <label for="password">Password</label>
	            </div>
	          </div>
	          <div class="row">
	            <div class="input-field col s12">
	              <button class="btn waves-effect waves-light right" type="submit" name="action">Submit
	                <i class="material-icons right">send</i>
	              </button>
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
	require('materialize-css/dist/js/materialize');

	export default {
		name: 'nhm-login-bar',

		data() {
			return {
				key: null,
				provider: {
					email: null,
					pass: null
				}
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

		methods: {
			showPanel: function(param) {

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

</style>