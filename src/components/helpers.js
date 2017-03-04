/* extra app helpers */

import Vue from 'vue'


/* eslint-disable no-new */
export const eventBus = new Vue();

export const resourceTypes = {
	RESOURCES: { name: 'resources', display: 'Resources'},
    EVENTS: { name: 'events', display: 'Events'},
    URGENTNEEDS: { name: 'urgent-needs', display: 'Urgent Needs'}
};