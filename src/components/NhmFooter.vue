<template>
	<footer class="--page-footer nhm-dark-blue">
	    <div class="footer-copyright">
			<div class="container">
				Made by <a class="red-text text-darken-4" :href="website">{{author}}</a>
			</div>
	    </div>
	</footer>
</template>


<script>
	import { eventBus } from '../main';
	require('materialize-css/dist/js/materialize');

	export default {
		name: 'nhm-footer',

		data() {
			return {
				author: 'SiggyWorks',
				website: "http://www.siggyworks.com"
			};
		},

		created() {
		},

		methods: {
			doTestClick: function(param) {
				console.log('Test button clicked!');
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