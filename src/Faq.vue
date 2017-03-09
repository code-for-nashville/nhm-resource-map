<template>
	<div id="faq" class="section faq-container main-section">

	    <div class="container">

	    	<h5>Frequently Asked Questions (FAQ)</h5>

	    	<div class="row">
				
				<div class="col s12">
					<p>A collection of frequently asked questions for resource providers, on how to use this platform, will be stored
					here in the future.  So in the meantime, send your questions to the <b>Nashville Metro Human Relations Commission</b>.
					</p>
				</div>

				<ul v-for="faq in faqs" class="collapsible col s12" data-collapsible="expandable">
					<li>
						<div class="collapsible-header">
							<i class="material-icons">info_outline</i>{{ translate[getQTranslationKey(faq.id)] }}
						</div>
						<div class="collapsible-body"><span>{{ translate[getATranslationKey(faq.id)] }}</span></div>
					</li>
				</ul>

	    	</div>

    	</div><!-- /.container -->
	</div>
</template>

<script>
	//
	import { eventBus } from './components/helpers';
	import nhmservice from './gateways/nhmservice';
	require('materialize-css/dist/js/materialize');

	export default {
		name: 'faq',

		data() {
			return {
				author: 'SiggyWorks',
				website: "http://www.siggyworks.com",
				faqs: [],
				translate: {
					transcription: null
				},
				locale: 'en',
			};
		},

		created() {},

		mounted() {
			$('.collapsible').collapsible();

			eventBus.$on('locale-change', new_locale => {
				console.log('FAQ heard locale-change');
				this.locale = new_locale;
				for(let k in this.faqs) {
					this._t(this.faqs[k]);
				}
			});

			this.fetchFaqs();
		},

		updated() {
			console.log('FAQ updated...');
			$('.collapsible').collapsible();

			for(let k in this.faqs) {
				//console.log('translating ', k);
				this._t(this.faqs[k]);
			}
		},

		methods: {
			_t: function(faq, context) {
				if(this.translate['q_' + this.locale + '_' +faq.id]) {
					return;
				}

				//this.translate[key] = this[key];
				var q = faq.question + '=|=' + faq.answer;

				if(this.locale !== 'en') {
					nhmservice.googleTranslate(this, {
							q: q,
							target: this.locale
						},
						function(transText) {
							var pieces = transText.split('=|=');
							this.translate[this.getQTranslationKey(faq.id)] = pieces[0];
							this.translate[this.getATranslationKey(faq.id)] = pieces[1];
						}.bind(this));
				} else {
					this.translate[this.getQTranslationKey(faq.id)] = faq.question;
					this.translate[this.getATranslationKey(faq.id)] = faq.answer;
				}
				//console.log(this.translate);
				//return this.translate[key];
			},

			getQTranslationKey(id) {
				return 'q_' + this.locale + '_' + id;
			},
			getATranslationKey(id) {
				return 'a_' + this.locale + '_' + id;
			},

			fetchFaqs() {
			  	nhmservice.getFaqs(this)
			  		.then((resp) => {
			  			this.faqs = resp.data;
			  			console.log(this.faqs);
			  			for(let k in this.faqs) {
							console.log('translating ', k);
							this._t(this.faqs[k]);
						}
			  		}, (err) => {
			  			console.log("whoops...error: " + err);
			  		});
			  },
		}
	}
</script>

<style scoped>

	/* FAQ Container */
	.faq-container {
		height: 100vh;
		padding-top: 80px;
	}

	.icon-block {
		padding: 0 15px;
	}
	.icon-block .material-icons {
		font-size: inherit;
	}

</style>