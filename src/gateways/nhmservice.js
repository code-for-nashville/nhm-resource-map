/* NHM Service module */

//import {router} from '../main'

// URL and endpoint constants
const API_URL = 'http://127.0.0.1:8000/resources/'
const BASE_URL = 'http://127.0.0.1:8000/'
const LOGIN_URL = API_URL + 'account/authenticate/'
const SIGNUP_URL = API_URL + 'account/register/'

export default {
	// User object will let us check authentication status
	user: {
		authenticated: false
	},

	// Send a request to the login URL and save the returned JWT
	login(context, creds, redirect) {
		context.$http.post(LOGIN_URL, creds, (data) => {
			localStorage.setItem('id_token', data.id_token)

			this.user.authenticated = true

			// Redirect to a specified route
			if(redirect) {
				//router.go(redirect)        
			}

		}).error((err) => {
			context.error = err
		})
	},

	signup(context, creds, redirect) {
		context.$http.post(SIGNUP_URL, creds, (data) => {
			localStorage.setItem('id_token', data.id_token)

			this.user.authenticated = true

			if(redirect) {
				//router.go(redirect)        
			}

		}).error((err) => {
			context.error = err
		})
	},

	// To log out, we just need to remove the token
	logout() {
		localStorage.removeItem('id_token')
		this.user.authenticated = false
	},

	checkAuth() {
		var jwt = localStorage.getItem('id_token')
		if(jwt) {
			this.user.authenticated = true
		}
		else {
			this.user.authenticated = false      
		}
	},

	// The object to be passed as a header for authenticated requests
	getAuthHeader() {
		return {
			'Authorization': 'Bearer ' + localStorage.getItem('id_token')
		}
	},

	// Provider--Request Access
	providerRequestAccess(context, params) {
		console.log(params);
		const endpoint = BASE_URL + 'account/request-access/';
		return context.$http.post(endpoint, params);
	},

	/* *************** read endpoint wrappers ***************** */
	getServices(context) {
		const endpoint = API_URL + 'services/';
		return context.$http.get(endpoint);
	},

	searchResources(context, params) {
		let endpoint = API_URL + 'providers?search=' + (params.search ? params.search: '');
		if(params.service && parseInt(params.service)) {
			endpoint += '&service=' + params.service;
		}
		return context.$http.get(endpoint);
	}
}
