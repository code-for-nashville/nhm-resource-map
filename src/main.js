
//some materialize requirements?
require('materialize-css/dist/css/materialize.css');

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import Mapp from './Mapp'
import Provider from './Provider'
import Events from './Events'
import UrgentNeeds from './UrgentNeeds'
import Faq from './Faq'

require('materialize-css/dist/js/materialize');

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

/* eslint-disable no-new */
export const eventBus = new Vue();

export const resourceTypes = {
	RESOURCES: { name: 'resources', display: 'Resources'},
    EVENTS: { name: 'events', display: 'Events'},
    URGENTNEEDS: { name: 'urgent-needs', display: 'Urgent Needs'}
};

const routes = [
		{ path: '/', component: Mapp, name: 'home', props: true },
		{ path: '/account/:id', component: Provider, name: 'account', props: true },
		{ path: '/events/:id', component: Events, name: 'events', props: true },
		{ path: '/urgent-needs/:id', component: UrgentNeeds, name: 'urgentneeds', props: true },
		{ path: '/faq', component: Faq, name: 'faq' },
	]

const router = new VueRouter({
	routes,
	mode: 'history'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  http: {
  	emulateJSON: true,
    //emulateHTTP: true
  }
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

