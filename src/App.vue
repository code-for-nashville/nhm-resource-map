<template>
  <div id="app">
    <nhm-navbar v-on:show-login-bar="doShowLoginBar"></nhm-navbar>
    <nhm-login-bar></nhm-login-bar>
    <nhm-map></nhm-map>
    <nhm-results-panel v-on:do-search="doHandleSearch" v-bind:results="results"></nhm-results-panel>
    <nhm-footer></nhm-footer>
  </div>
</template>

<script>
  import NhmNavbar from './components/NhmNavbar'
  import NhmLoginBar from './components/NhmLoginBar'
  import NhmMap from './components/NhmMap'
  import NhmResultsPanel from './components/NhmResultsPanel'
  import NhmFooter from './components/NhmFooter'
  import { resourceTypes } from './main'
  import nhmservice from './gateways/nhmservice';

  require('materialize-css/dist/js/materialize');

  export default {
    name: 'app',
    components: {
      NhmNavbar, NhmLoginBar, NhmMap, NhmResultsPanel, NhmFooter
    },
    data() {
      return {
        resourceType: resourceTypes.RESOURCES.name,
        results: []
      };
    },
    created() {
      console.log('App.vue created...');
      $('.login-panel-trigger').sideNav();
    },
    mounted() {
      console.log('App.vue mounted...');
      $('select:not([multiple])').material_select();
      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
          selectYears: 3, // Creates a dropdown of 3 years to control year
          container: 'body',
          closeOnSelect: true
      });
    },
    methods: {
      doShowLoginBar: function(event) {
        console.log('doing show-login-bar...');
        //$('.login-panel-trigger').sideNav('show');
      },
      doHandleSearch: function(params) {
        console.log('handling do-search', params);
        let webservice;

        switch(params.resourceType) {
          case resourceTypes.RESOURCES.name:
            webservice = nhmservice.searchResources(this, params);
            break;
          case resourceTypes.EVENTS.name:
            break;
          case resourceTypes.URGENTNEEDS.name:
            break;
          default:
            break;
        }

        if(webservice) {
          webservice.then((response) => {
            this.results = response.data;
            //this.$set(this.services, response.data);
            console.log('got data...', this.results);

          }, (err) => {
            //context.error = err;
            console.log('whoops...error...', err);
          });
        }

      } //doHandleSearch

    } //methods

  }
</script>

<style>
  #app {
    /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
    /* -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50; */
    /* margin-top: 60px; */
  }

  .icon-block {
    padding: 0 15px;
  }
  .icon-block .material-icons {
    font-size: inherit;
  }

  /*  Generics  */
  .nhm-dark-blue {
    background-color: #282C35;
  }
  .nhm-blue {
    color: #23A1CB;
  }
  .nhm-bg-blue, .btn, .btn:hover {
    background-color: #23A1CB; 
  }
  label.active {
    color: #23A1CB !important;
  }
  input[type=text]:focus:not([readonly]),
  input[type=email]:focus:not([readonly]),
  input[type=password]:focus:not([readonly]) {
    border-bottom: 1px solid #23A1CB !important;
  }
  [type="checkbox"].filled-in:checked + label:after {
    border-color: #23A1CB;
    background-color: #23A1CB;
  }
  .padding {
    padding: 20px;
  }
  .pad-top {
    padding-top: 0.75rem;
}
</style>
