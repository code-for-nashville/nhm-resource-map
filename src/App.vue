<template>
  <div id="app">
    <nhm-navbar v-on:show-login-bar="doShowLoginBar"></nhm-navbar>
    <nhm-login-bar v-on:provider-authenticated="doProviderAuthenticated"></nhm-login-bar>
    <nhm-map v-bind:markers="markers" v-on:popup-provider="doPopupProvider"></nhm-map>
    <nhm-results-panel 
      v-on:do-search="doHandleSearch"
      v-on:clear-results="doClearResults" 
      v-on:popup-provider="doPopupProvider"
      v-bind:results="results"></nhm-results-panel>
    <nhm-footer></nhm-footer>

    <div id="mapModal" class="modal modal-close">
      <div class="card horizontal">
        <div class="card-image">
          <img :class="{padded: !selected_provider.avatar}" :src="getSelectedProviderAvatar">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <h5>{{ selected_provider.name }}</h5>
            <p class="text-small">{{ selected_provider.address1}} <span v-if="selected_provider.address2" class="text-small">, {{ selected_provider.address2}}</span></p>
            
            <p v-if="selected_provider.city || selected_provider.state" class="text-small">
              {{ selected_provider.city}} {{ selected_provider.state }} {{ selected_provider.zip }}
            </p>
            <p>
              <strong>{{ selected_provider.phone }}</strong><br/>
            </p>
            <p v-if="selected_provider.description">{{ selected_provider.description }}</p>
          </div>
          <div class="card-action">
            <a v-if="selected_provider.website" :href="selected_provider.website" target="_blank">Visit Website</a>
            <a v-if="selected_provider.facebook" :href="selected_provider.website" target="_blank">Visit Facebook</a>
          </div>
        </div>
      </div>
    </div>

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
        results: [],
        markers: [],
        selected_provider: {},
        provider: {},
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
      $('.modal').modal();
    },
    updated() {
      this.updateMarkers();
    },
    computed: {
      getSelectedProviderAvatar: function() {
        if(this.selected_provider && this.selected_provider.services) {
          return this.selected_provider.avatar ? this.selected_provider.avatar : this.selected_provider.services[0].icon;
        }
        return "/static/img/mhrc_logo.png";
      }
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
            this.updateMarkers();
            //this.$set(this.services, response.data);
            console.log('got data into this.results[]');

          }, (err) => {
            //context.error = err;
            console.log('whoops...error...', err);
          });
        }

      }, //doHandleSearch

      doClearResults: function() {
        this.results = [];
      }, 

      doPopupProvider: function(provider_id, location) {
        var $modal = $('#mapModal');

        //find the right provider object
        for(let p=0; p < this.results.length; p++) {
          if(this.results[p].id === provider_id) {
            this.selected_provider = this.results[p];
            break;
          }
        }
        
        if(this.selected_provider) {
          if(location) {
            this.selected_provider.address1 = location.address1;
            this.selected_provider.address2 = location.address2;
            this.selected_provider.city = location.city;
            this.selected_provider.state = location.state;
            this.selected_provider.zip = location.zip;
          }
          $modal.modal('open');
        }

        console.log('popup-provider event heard...', provider_id);
      },

      doProviderAuthenticated: function(provider) {
        if(provider) {
          this.provider = provider;
        }
      },

      updateMarkers: function() {
        var temp = [];
        for(let i=0; i < this.results.length; i++) {
          for(let j=0; j < this.results[i].locations.length; j++) {
            let t = {...this.results[i].locations[j]};
            t.provider = this.results[i].name;
            t.provider_id = this.results[i].id;
            t.item_name = t.name;
            t.icon = this.results[i].avatar || this.results[i].services[0].icon;
            temp.push(t);
          }
        }
        this.markers = temp;
        console.log('App has updated markers -->', this.markers);
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
