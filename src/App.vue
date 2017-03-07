<template>
  <div id="app">
    <nhm-navbar :showMenu="showNavMenu" 
    v-on:show-login-bar="doShowLoginBar"
    v-on:locale-change="doLocaleChange"
    v-bind:topLocale="locale"></nhm-navbar>
    <nhm-login-bar v-on:provider-authenticated="doProviderAuthenticated"
                    v-on:route-clicked="doRouteClicked" v-bind:locale="locale"></nhm-login-bar>
    <router-view></router-view>
    <nhm-footer v-bind:locale="locale"></nhm-footer>
  </div>
</template>

<script>
  import NhmNavbar from './components/NhmNavbar'
  import NhmLoginBar from './components/NhmLoginBar'
  import NhmFooter from './components/NhmFooter'
  import { resourceTypes, eventBus } from './components/helpers'
  import nhmservice from './gateways/nhmservice';

  require('materialize-css/dist/js/materialize');

  export default {
    name: 'app',
    components: {
      NhmNavbar, NhmLoginBar, NhmFooter
    },
    data() {
      return {
        showNavMenu: true,
        locale: 'en',
      };
    },
    created() {
      console.log('App.vue created...');
      $('.login-panel-trigger').sideNav();
    },
    mounted() {
      console.log('App.vue mounted...');

      eventBus.$on('locale-change', locale => {
        this.locale = locale;
        console.log("...also App heard locale-change: " + this.locale);
      });

      /*
      $('select:not([multiple])').material_select();
      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
          selectYears: 3, // Creates a dropdown of 3 years to control year
          container: 'body',
          closeOnSelect: true
      });
      $('.modal').modal();
      */
    },
    updated() {
      //this.updateMarkers();
    },
    computed: {
      /*
      getSelectedProviderAvatar: function() {
        if(this.selected_provider && this.selected_provider.services) {
          return this.selected_provider.avatar ? this.selected_provider.avatar : this.selected_provider.services[0].icon;
        }
        return "/static/img/mhrc_logo.png";
      }
      */
    },
    methods: {
      doShowLoginBar: function(event) {
        console.log('doing show-login-bar...');
        //$('.login-panel-trigger').sideNav('show');
      },
      doProviderAuthenticated: function() {
        console.log('provider authenticated in top App');
        //get provider ...and pass it down to Provider, Event, and UrgentNeed components
        
      },
      doRouteClicked: function(name) {
        console.log('route-clicked...', name);
        if(name === 'home') {
          this.showNavMenu = true;
        } else {
          this.showNavMenu = false;
        }
        $('.login-panel-trigger').sideNav('hide');
      },
      doServicesLoaded: function(services) {

      },
      doLocaleChange: function(new_locale) {
        this.locale = new_locale;
        console.log('changed locale to ' + this.locale);
      }

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

  .card.horizontal {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .card-image img.padded {
    padding-top: 24px;
    padding-left: 14px;
  }

  /*  Generics  */
  .nhm-dark-blue {
    background-color: #282C35;
  }
  .nhm-blue {
    color: #23A1CB !important;
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
