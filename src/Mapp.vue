<template>
  <div id="mapp">
    <nhm-map v-bind:markers="markers" 
      v-on:popup-provider="doPopupProvider"
      v-on:popup-event="doPopupEvent"
      v-on:popup-urgent-need="doPopupUrgentNeed"></nhm-map>
    <nhm-results-panel 
      v-on:do-search="doHandleSearch"
      v-on:clear-results="doClearResults" 
      v-on:popup-provider="doPopupProvider"
      v-on:popup-event="doPopupEvent"
      v-on:popup-urgent-need="doPopupUrgentNeed"
      v-bind:results="results"
      v-bind:services="services"
      v-bind:clienttypes="clienttypes"
      v-bind:resource-type="resourceType"></nhm-results-panel>

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
            <p v-if="selected_provider.description">{{ selected_provider.description }}</p><br/>
            <div class="row">
              <p class="col s6">
                <strong>Services</strong><br/>
                <span v-for="srvc in selected_provider.services">{{srvc.name}}<br/></span>
                <span v-if="!(selected_provider.services && selected_provider.services.length)">No services information provided</span>
              </p>
              <p class="col s6">
                <strong>Client Types</strong><br/>
                <span v-for="ctype in selected_provider.client_types">{{ctype.name}}<br/></span>
                <span v-if="!(selected_provider.client_types && selected_provider.client_types.length)">No client information provided</span>
              </p>
            </div>
          </div>
          <div class="card-action">
            <a v-if="selected_provider.website" :href="selected_provider.website" target="_blank">Visit Website</a>
            <a v-if="selected_provider.facebook" :href="selected_provider.website" target="_blank">Visit Facebook</a>
          </div>
        </div>
      </div>
    </div>

    <div id="mapModal2" class="modal modal-close events">
      <div class="card horizontal">
        <div class="card-image">
          <img :class="{padded: !selected_provider.avatar}" :src="getSelectedProviderAvatar">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <h5>{{ selected_provider.title }}</h5>
            <p v-if="selected_provider.event_starttime" class="text-large">
              <strong>{{ selected_provider.event_month }} {{ selected_provider.event_day_of_month }}</strong> at <strong>{{ selected_provider.event_starttime }}</strong><br/>
            </p>
            <p class="text-small">{{ selected_provider.event_address1}} <span v-if="selected_provider.address2" class="text-small">, {{ selected_provider.event_address2}}</span></p>
            <p v-if="selected_provider.city || selected_provider.state" class="text-small">
              {{ selected_provider.event_city}} {{ selected_provider.event_state }} {{ selected_provider.event_zip }}
            </p>
            
            <p v-if="selected_provider.description">{{ selected_provider.description }}</p>
          </div>
          <div class="card-action">
            <a v-if="selected_provider.event_url" :href="selected_provider.event_url" target="_blank">Visit Event Website</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  //import NhmNavbar from './components/NhmNavbar'
  //import NhmLoginBar from './components/NhmLoginBar'
  import NhmMap from './components/NhmMap'
  import NhmResultsPanel from './components/NhmResultsPanel'
  //import NhmFooter from './components/NhmFooter'
  import { resourceTypes, eventBus } from './components/helpers'
  import nhmservice from './gateways/nhmservice';

  require('materialize-css/dist/js/materialize');

  export default {
    name: 'mapp',
    components: {
      //NhmNavbar, 
      //NhmLoginBar, 
      NhmMap, 
      NhmResultsPanel, 
      //NhmFooter
    },
    data() {
      return {
        resourceType: resourceTypes.RESOURCES.name,
        results: [],
        markers: [],
        services: [],
        clienttypes: [],
        selected_provider: {},
        provider: {},
        //showNavMenu: true,
      };
    },
    created() {
      console.log('Mapp.vue created...');
    },
    mounted() {
      console.log('Mapp.vue mounted...');
      $('select:not([multiple])').material_select();
      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
          selectYears: 3, // Creates a dropdown of 3 years to control year
          container: 'body',
          closeOnSelect: true
      });
      $('.modal').modal();

      //Register for listners
      eventBus.$on('select-resource-type', resourceType => {
        //console.log('bus: received select-resource-type event. Showing...', resourceType);
        if(this.resourceType !== resourceType) {
          //console.log(this.results, this.resourceType);
          this.doClearResults();
          this.resourceType = resourceType;
        }
      });

      // fetch the services
      nhmservice.getServices(this).then((response) => {
        this.services = response.data;
        //this.$set(this.services, response.data);
        //console.log('got data...', this.services);
        eventBus.$emit('services-loaded', this.services);

      }, (err) => {
        //context.error = err;
        console.log('whoops...error...', err);
      });

      // fetch the client types
      nhmservice.getClientTypes(this).then((response) => {
        this.clienttypes = response.data;
        eventBus.$emit('client-types-loaded', this.clienttypes);

      }, (err) => {
        //context.error = err;
        console.log('whoops...error...', err);
      });

    },
    updated() {
      this.updateMarkers(this.resourceType);
      //console.log('Mapp updated ...resourceType: ' + this.resourceType);
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
      doHandleSearch: function(params) {
        console.log('handling do-search', params);
        let webservice;

        switch(params.resourceType) {
          case resourceTypes.RESOURCES.name:
            nhmservice.searchResources(this, params)
              .then((response) => {
                this.results = response.data;
                this.updateMarkers(params.resourceType);
                //this.$set(this.services, response.data);
                //console.log('received providers into this.results[]' + params.resourceType);

              }, (err) => {
                //context.error = err;
                console.log('whoops... resources error...', err);
              });
            break;
          case resourceTypes.EVENTS.name:
            nhmservice.searchEvents(this, params)
              .then((response) => {
                this.results = response.data;
                this.updateMarkers(params.resourceType);
                //this.$set(this.services, response.data);
                //console.log('received events into this.results[]');

              }, (err) => {
                //context.error = err;
                console.log('whoops... events error...', err);
              });
            break;
          case resourceTypes.URGENTNEEDS.name:
            nhmservice.searchUrgentNeeds(this, params)
              .then((response) => {
                this.results = response.data;
                this.updateMarkers(params.resourceType);
                //this.$set(this.services, response.data);
                //console.log('received urgent-needs into this.results[]',this.results);

              }, (err) => {
                //context.error = err;
                console.log('whoops... urgent-needs error...', err);
              });
            break;
          default:
            break;
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

      doPopupEvent: function(event_id, location) {
        var $modal = $('#mapModal2');

        //find the right event object
        for(let p=0; p < this.results.length; p++) {
          if(this.results[p].id === event_id) {
            this.selected_provider = this.results[p];
            break;
          }
        }
        
        if(this.selected_provider) {
          $modal.modal('open');
        }

        console.log('popup-event event heard...', event_id);
      },

      doPopupUrgentNeed: function(event_id, location) {
        var $modal = $('#mapModal2');

        //find the right event object
        for(let p=0; p < this.results.length; p++) {
          if(this.results[p].id === event_id) {
            this.selected_provider = this.results[p];
            break;
          }
        }
        
        if(this.selected_provider) {
          $modal.modal('open');
        }

        console.log('popup-urgent-need event heard...', event_id);
      },

      doProviderAuthenticated: function(provider) {
        if(provider) {
          this.provider = provider;
        }
      },

      updateMarkers: function(resourceType) {
        //console.log("From updateMarkers: " + resourceType);
        var temp = [];
        if (resourceType == resourceTypes.RESOURCES.name) {
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
        } else if(resourceType == resourceTypes.EVENTS.name) {
          for(let i=0; i < this.results.length; i++) {
              let t = {...this.results[i]};
              t.provider_name = this.results[i].event_host;
              t.longitude = this.results[i].event_coordinates[0];
              t.latitude = this.results[i].event_coordinates[1];
              t.provider_id = this.results[i].id;   //event_host_id;
              t.item_name = t.title;
              //t.icon = this.results[i].avatar || this.results[i].services[0].icon;
              temp.push(t);
          }
        } else if(resourceType == resourceTypes.URGENTNEEDS.name) {
          for(let i=0; i < this.results.length; i++) {
              let t = {...this.results[i]};
              t.provider_name = this.results[i].event_host;
              t.longitude = this.results[i].event_coordinates[0];
              t.latitude = this.results[i].event_coordinates[1];
              t.provider_id = this.results[i].id;   //event_host_id;
              t.item_name = t.title;
              //t.icon = this.results[i].avatar || this.results[i].services[0].icon;
              temp.push(t);
          }
        }
        this.markers = temp;
        //console.log('Mapp has updated markers -->', resourceType, this.markers);
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
  .modal .card.horizontal .card-image {
    max-width: 25%;
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
