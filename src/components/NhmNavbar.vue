<template>
	<nav id="main-nav" class="nhm-dark-blue" role="navigation">
		<div class="nav-wrapper container">
			<a href="#" data-activates="login-panel" class="login-panel-trigger">
				<i class="material-icons">menu</i>
			</a>
			<a id="logo-container" href="#" data-activates="login-panel" class="nhm-brand-logo login-panel-trigger">
				<img src="../assets/img/nav_logo.png" class="nhm-logo"/>
			</a>
			<ul v-show="showMenu" class="right -hide-on-med-and-down">
				<li v-for="item in menuitems">
					<a href="#" data-activates="results-panel" :class="{'nhm-blue': checkActive(item.id)}" class="results-panel-trigger" :data-name="item.name" @click="selectResourceType(item.name, item.id)">{{ item.display }}</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
	import { eventBus, resourceTypes } from './helpers';

	require('materialize-css/dist/js/materialize');

	export default {
		name: 'nhm-navbar',

		props: {
			showMenu: {
				default: true,
				type: Boolean
			}
		},

		data() {
			// your data object
			return {
				itemId: 0,
				menuitems: [ 
					{ id: 1, name: resourceTypes.RESOURCES.name, display: 'Resources'},
					{ id: 2, name: resourceTypes.EVENTS.name, display: 'Events'},
					{ id: 3, name: resourceTypes.URGENTNEEDS.name, display: 'Urgent Needs'},
				]
			};
		},

		mounted() {
	    	console.log('NhmNavbar.vue mounted...');
	    	$('.login-panel-trigger').sideNav();
	    	// Select - Single
      		//$('select:not([multiple])').material_select();
      		/*
      		$('.datepicker').pickadate({
				selectMonths: true, // Creates a dropdown to control month
			    selectYears: 3, // Creates a dropdown of 3 years to control year
			    container: 'body',
			    closeOnSelect: true
			});
			*/
	    },

		methods: {
	      showLoginBar() {
	      	console.log('login-panel-trigger was clicked!');
	        //eventBus.$emit('show-login-bar');
	      },
	      selectResourceType(resourceType, itemId) {
	      	this.itemId = itemId;
	      	eventBus.$emit('select-resource-type', resourceType);
	      },
	      checkActive(item_id) {
	      	if(item_id === this.itemId ) {
	      		return true;
	      	}
	      	return false;
	      }
	    }
	}

</script>

<style scoped>

	.nhm-brand-logo {
		display: inline-block;
		height: inherit;
	}
	.nhm-logo {
		height: inherit;
		width: auto;
	}
	.login-panel-trigger {
		float: left;
		position: relative;
	}

	#main-nav {
		z-index: 100;
	    position: absolute;
	    top: 0px;
	    left: 0px;
	}

</style>
