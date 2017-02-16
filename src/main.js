
//some materialize requirements?
require('materialize-css/dist/css/materialize.css');

import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'

require('materialize-css/dist/js/materialize');

Vue.use(VueResource);

/* eslint-disable no-new */
export const eventBus = new Vue();

export const resourceTypes = {
	RESOURCES: { name: 'resources', display: 'Resources'},
    EVENTS: { name: 'events', display: 'Events'},
    URGENTNEEDS: { name: 'urgent-needs', display: 'Urgent Needs'}
};

new Vue({
  el: '#app',
  render: h => h(App)
});

/*
Vue.http.interceptors.push(function(request, next) {

	// modify method
	request.method = 'POST';

	// modify headers
	request.headers.set('X-CSRF-TOKEN', 'TOKEN');
	request.headers.set('Authorization', 'Bearer TOKEN');

	// continue to next interceptor
	next();

});
*/

