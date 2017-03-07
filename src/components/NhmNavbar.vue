<template>
	<nav id="main-nav" class="nhm-dark-blue" role="navigation">
		<div class="nav-wrapper container">
			<a href="#" data-activates="login-panel" class="login-panel-trigger">
				<i class="material-icons">menu</i>
			</a>
			<a id="logo-container" href="#" data-activates="login-panel" class="nhm-brand-logo login-panel-trigger">
				<img src="../assets/img/nav_logo.png" class="nhm-logo"/>
			</a>

			<div v-show="showMenu" class="input-field col right locale-options">
			    <select v-model="locale" id="locale-changer" v-change="doLocaleChanged">
			    	<option v-for="lang in locales" :value="lang.iso_code">{{ lang.language }}</option>
			    </select>
			</div>

			<ul v-show="showMenu" class="right -hide-on-med-and-down">
				<li v-for="item in menuitems">
					<a href="#" data-activates="results-panel" :class="{'nhm-blue': checkActive(item.id)}" class="results-panel-trigger" :data-name="item.name" @click="selectResourceType(item.name, item.id)">{{ translate[item.display] }}</a>
				</li>
			</ul>

		</div>
	</nav>
</template>

<script>
	import { eventBus, resourceTypes } from './helpers';
	import nhmservice from '../gateways/nhmservice';

	require('materialize-css/dist/js/materialize');

	export default {
		name: 'nhm-navbar',

		props: {
			showMenu: {
				default: true,
				type: Boolean
			},
			topLocale: {
				default: 'en',
				type: String
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
				],
				locales: [],
				locale: 'en',
				messages: {
					Resources: 'Resources',
					Events: 'Events',
					'Urgent Needs': 'Urgent Needs'
				},
				translate: {
					Resources: 'Resources',
					Events: 'Events',
					"Urgent Needs": 'Urgent Needs'
				}
			};
		},

		mounted() {
	    	console.log('NhmNavbar.vue mounted...');

	    	//translate items in translate object
			for(let k in this.messages) {
				console.log('translating ' + k);
				this._t(k, this.messages);
			}

	    	$('.login-panel-trigger').sideNav();
	    	
      		$('select:not([multiple])').material_select();

      		//fetch Languages
      		this.fetchLanguages();

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
		  fetchLanguages() {
		  	nhmservice.getLanguages(this)
		  		.then((resp) => {
		  			this.locales = resp.data;
		  			this.locales.unshift({ id: 0, iso_code: 'en', language: 'English'});
		  			if(this.locale !== 'en') this.doLocaleChanged();
		  		}, (err) => {
		  			console.log("whoops...error: " + err);
		  		});
		  },
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
	      },
	      _t: function(key, context) {
	      		if(!context) context = this;
				console.log( key + " on 'this': ", context[key]);

				this.translate[key] = context[key];

				if(this.locale !== 'en') {
					nhmservice.googleTranslate(this, {
						q: context[key],
						target: this.locale
					},
					function(transText) {
						this.translate[key] = transText;
					}.bind(this));
				}
				
				return this.translate[key];
			},

			doLocaleChanged: function() {
				this.locale = $('#locale-changer').val();
				this.$emit('locale-change', this.locale);
				eventBus.$emit('locale-change', this.locale);

				//translate items in translate object
				for(let k in this.messages) {
					console.log('translating ' + k);
					this._t(k, this.messages);
				}
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

	.results-panel-trigger {
		text-transform: capitalize;
	}

	#main-nav {
		z-index: 100;
	    position: absolute;
	    top: 0px;
	    left: 0px;
	}

	.locale-options {
		margin-top: 10px;
		margin-right: -60px;
		margin-left: 40px;
	}

</style>
