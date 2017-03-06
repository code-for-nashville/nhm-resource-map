<template>
	<footer class="--page-footer nhm-dark-blue">
	    <div class="footer-copyright">
			<div class="container">
				{{ translate.transcription }} <a class="red-text text-darken-4" :href="website">{{author}}</a>
			</div>
	    </div>
	</footer>
</template>


<script>
	import { eventBus } from './helpers';
	import nhmservice from '../gateways/nhmservice';
	require('materialize-css/dist/js/materialize');

	export default {
		name: 'nhm-footer',

		data() {
			return {
				author: 'SiggyWorks',
				website: "http://www.siggyworks.com",
				transcription: "Made by",

				translate: {
					transcription: null
				},

				locale: 'en',
			};
		},

		created() {
		},

		mounted() {
			//translate items in translate object
			for(let k in this.translate) {
				console.log('translating ' + k);
				this._t(k);
			}

			eventBus.$on('locale-change', new_locale => {
				this.locale = new_locale;
				for(let k in this.translate) {
					console.log('translating ' + k);
					this._t(k);
				}
			});
		},

		updated() {
		  //translate items in translate object
		  /*
	      for(let k in this.translate) {
			console.log('translating ' + k);
			this._t(k);
		  }
		  */
		},

		methods: {
			doTestClick: function(param) {
				console.log('Test button clicked!');
			},

			_t: function(key) {
				console.log( key + " on 'this': ", this[key]);

				this.translate[key] = this[key];

				if(this.locale !== 'en') {
					nhmservice.googleTranslate(this, {
						q: this[key],
						target: this.locale
					},
					function(transText) {
						this.translate[key] = transText;
					}.bind(this));
				}
				
				return this.translate[key];
			}
		}
	}
</script>


<style scoped>

	.--page-footer {
		width: 100vw;
		position: fixed;
		bottom: 0px;
		left: 0px;
		color: white;
		font-size: 0.9em;
		font-weight: 400;
		padding: 10px;
		z-index: 99;
	}

	.footer-copyright {
		font-size: 0.9em;
	}

</style>