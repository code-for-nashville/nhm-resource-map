<template>
  <div id="mapp">
    <nhm-map v-bind:markers="markers" 
      v-on:popup-provider="doPopupProvider"
      v-on:popup-event="doPopupEvent"
      v-on:popup-urgent-need="doPopupUrgentNeed"
      v-bind:locale="locale"></nhm-map>
    <div class="bookmark-button">
      <a class="btn-floating btn-large waves-effect waves-light red tooltipped" 
      data-position="left" :data-tooltip="translate[getTranslationFieldName('bookmarkTooltip')]" @click.prevent="showBookmarkModal">
        <i class="material-icons">turned_in_out</i>
      </a>
    </div>
    <nhm-results-panel 
      v-on:do-search="doHandleSearch"
      v-on:clear-results="doClearResults" 
      v-on:popup-provider="doPopupProvider"
      v-on:popup-event="doPopupEvent"
      v-on:popup-urgent-need="doPopupUrgentNeed"
      v-bind:locale="locale"
      v-bind:results="results"
      v-bind:services="services"
      v-bind:clienttypes="clienttypes"
      v-bind:resource-type="resourceType"
      v-bind:bookmarkedSearch="currentQuery"></nhm-results-panel>

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
            <p v-if="translate[getTranslationFieldName('selected_provider_description'+selected_provider.id)]">{{ translate[getTranslationFieldName('selected_provider_description'+selected_provider.id)] }}</p><br/>
            <!--
            <div v-else class="progress">
                <div class="indeterminate"></div>
            </div>
            -->
            <div class="row">
              <p class="col s6">
                <strong>{{ translate[getTranslationFieldName('services')] }}</strong><br/>
                <span v-for="srvc in selected_provider.services">{{ translate[getTranslationFieldName(srvc.name)] }}<br/></span>
                <span v-if="!(selected_provider.services && selected_provider.services.length)">{{ translate[getTranslationFieldName('noServicesInfo')] }}</span>
              </p>
              <p class="col s6">
                <strong>{{ translate[getTranslationFieldName('clientTypes')] }}</strong><br/>
                <span v-for="ctype in selected_provider.client_types">{{ translate[getTranslationFieldName(ctype.name)] }}<br/></span>
                <span v-if="!(selected_provider.client_types && selected_provider.client_types.length)">{{ translate[getTranslationFieldName('noClientsInfo')] }}</span>
              </p>
            </div>
          </div>
          <div class="card-action">
            <a v-if="selected_provider.website" :href="selected_provider.website" target="_blank">{{ translate[getTranslationFieldName('websiteButton')] }}</a>
            <a v-if="selected_provider.facebook" :href="selected_provider.website" target="_blank">{{ translate[getTranslationFieldName('facebookButton')] }}</a>
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
            
            <p v-if="selected_provider.description">{{ translate[getTranslationFieldName('selected_provider_description'+selected_provider.id)] }}</p>
          </div>
          <div class="card-action">
            <a v-if="selected_provider.event_url" :href="selected_provider.event_url" target="_blank">{{ translate[getTranslationFieldName('eventWebsiteButton')] }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Share/Bookmark Search Link -->
    <div id="bookmarkModal" class="modal modal-close">
        <div class="modal-content"> 
          <h5>{{ translate[getTranslationFieldName('bookmarkModalTitle')] }}</h5>
          <p>{{ translate[getTranslationFieldName('bookmarkModalInstructions')] }}:</p>
          <p align="center"><strong class="nhm-grey">{{ getBookmarkLink }}</strong></p>
        </div>
        <div class="modal-footer">
          <a class=" modal-action modal-close waves-effect waves-green btn-flat">{{ translate[getTranslationFieldName('bookmarkModalButtonDone')] }}</a>
        </div>
    </div>

    <!-- Translation Notice -->
    <div id="translatingModal" class="modal modal-close">
        <div class="modal-content"> 
          <h5>Translating site...</h5>
          <p align="center">Translating the site. This may take a few seconds!</p>
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        </div>
        <div class="modal-footer">
          <a class=" modal-action modal-close waves-effect waves-green btn-flat">Close</a>
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
        currentQuery: {},
        currentBookmark: null,
        locale: 'en',
        messages: {
          bookmarkTooltip: "Bookmark this search for sharing",
          websiteButton: "Visit Website",
          facebookButton: "Visit Facebook",
          eventWebsiteButton: "Visit Event Website",
          bookmarkModalTitle: "Share or bookmark this search?",
          bookmarkModalInstructions: "Use the link below to bookmark or share this search.  You can copy the link below and share it via social media or email.  The results of this search will be saved retrievable at this link",
          bookmarkModalButtonDone: "DONE",
          noServicesInfo: "No services information provided",
          noClientsInfo: "No client information provided",
          services: "Services",
          clientTypes: "Client Types"
        },
        selected_provider_desc: null,
        translate: {},
        //showNavMenu: true,
      };
    },
    props: {
    },
    created() {
      console.log('Mapp.vue created...');
      //translate items in translate object
      for(let k in this.messages) {
        //console.log('translating ' + k);
        this._t(k, this.messages);
      }
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
          this.currentBookmark = null;
        }
      });

      eventBus.$on('locale-change', locale => {
        this.locale = locale;
        console.log("...also Mapp heard locale-change: " + this.locale);
      });

      // fetch the services
      nhmservice.getServices(this).then((response) => {
        this.services = response.data;

        //add to translation shoe
        for(let x=0; x < this.services.length; x++) {
          //console.log(srvc, this.services[x])
          this.messages[this.services[x].name] = this.services[x].name;
        }

        //console.log('got data...', this.services);
        eventBus.$emit('services-loaded', this.services);

      }, (err) => {
        //context.error = err;
        console.log('whoops...error...', err);
      });

      // fetch the client types
      nhmservice.getClientTypes(this).then((response) => {
        this.clienttypes = response.data;

        //add to translation shoe
        for(let x=0; x < this.clienttypes.length; x++) {
          //console.log(srvc, this.clienttypes[x])
          this.messages[this.clienttypes[x].name] = this.clienttypes[x].name;
        }

        eventBus.$emit('client-types-loaded', this.clienttypes);

      }, (err) => {
        //context.error = err;
        console.log('whoops...error...', err);
      });

      // check if there's a q parameter which means we should autoexecute a bookmarked search
      if(this.$route.query && this.$route.query.q) {
        nhmservice.decodeBookmark(this, this.$route.query.q).then((response) => {
          this.currentQuery = response.data;
          console.log("decoded a bookmark (q parameter): " + this.$route.query.q + ", into -->", this.currentQuery);
          this.doHandleSearch(this.currentQuery);

        }, (err) => {
          //context.error = err;
          console.log('whoops...error...', err);
        });
      }

    },
    beforeUpdate: function() {
      //translate items in translate object
      for(let k in this.messages) {
        //console.log('beforeUpdated... translating ' + k);
        this._t(k, this.messages);
      }
    },
    updated() {
      console.log('Mapp updated...');
      this.updateMarkers(this.resourceType);

      //reinitialize tooltips
      $('.tooltipped').tooltip({delay: 50});
      //console.log('Mapp updated ...resourceType: ' + this.resourceType);

      //console.log(this.translate.bookmarkModalTitle);
    },
    computed: {
      getSelectedProviderAvatar: function() {
        if(this.selected_provider && this.selected_provider.services) {
          return this.selected_provider.avatar ? this.selected_provider.avatar : this.selected_provider.services[0].icon;
        }
        return "/static/img/mhrc_logo.png";
      },

      getBookmarkLink: function() {
        return window.location.protocol + '//' + window.location.host + '?q=' + this.currentBookmark;
      },

      getSelectedProviderDescription: function() {
        if(this.selected_provider) {
          return this.translate['selected_provider_description'];
        }

        return '';
      }
    },
    methods: {
      _t: function(key, context) {
        var self = this;
        if(!context) context = this;
        //console.log( key + " on 'this': ", context[key]);

        if(this.translate[this.getTranslationFieldName(key)]) {

          return this.translate[this.getTranslationFieldName(key)];

        } else {

          if(this.locale !== 'en') {
            nhmservice.googleTranslate(this, {
              q: context[key],
              target: this.locale
            },
            function(transText) {
              this.translate[this.getTranslationFieldName(key)] = transText;
              //console.log(this.translate[key]);
            }.bind(this));
          } else {
            this.translate[this.getTranslationFieldName(key)] = context[key];
          }

        }

        return this.translate[this.getTranslationFieldName(key)];
      },

      translateSelectedProviderDescription: function() {
        if(this.locale !== 'en') {
          nhmservice.googleTranslate(this, {
            q: this.selected_provider.description,
            target: this.locale
          },
          function(transText) {
            //this.translate['selected_provider_description'] = transText;
            this.translate[this.getTranslationFieldName('selected_provider_description'+this.selected_provider.id)] = transText;
          }.bind(this));
        } else {
          this.translate[this.getTranslationFieldName('selected_provider_description'+this.selected_provider.id)] = this.selected_provider.description;
        }
      },

      getTranslationFieldName: function(fieldName) {
        return fieldName + '_' + this.locale;
      },

      preFetchResultTranslations: function() {
        var self = this;
        //find the right provider object
        for(let p=0; p < this.results.length; p++) {
          var fetched_provider = this.results[p];

          (function(provider, context){
            if(context.locale !== 'en') {
              nhmservice.googleTranslate(context, {
                q: fetched_provider.description,
                target: context.locale
              },
              function(transText) {
                //this.translate['selected_provider_description'] = transText;
                context.translate[context.getTranslationFieldName('selected_provider_description'+fetched_provider.id)] = transText;
              }.bind(context));
            } else {
              context.translate[context.getTranslationFieldName('selected_provider_description'+fetched_provider.id)] = fetched_provider.description;
            }
          }(fetched_provider, self));
        }
      },

      doHandleSearch: function(params) {
        console.log('handling do-search', params);
        let webservice;
        if(params["clienttype"]) {
          params["clienttype"] = parseInt(params["clienttype"]);
        }
        if(params["service"]) {
          params["service"] = parseInt(params["service"]);
        }
        this.currentQuery = params;

        switch(params.resourceType) {
          case resourceTypes.RESOURCES.name:
            nhmservice.searchResources(this, params)
              .then((response) => {
                this.results = response.data;
                this.updateMarkers(params.resourceType);
                this.preFetchResultTranslations();
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
                this.preFetchResultTranslations();
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
                this.preFetchResultTranslations();
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

            this.translateSelectedProviderDescription()

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

      showBookmarkModal: function() {
        // regenerate currentBookmark for this currentQuery
        if(!this.currentBookmark) {
          nhmservice.encodeBookmark(this, this.currentQuery).then((response) => {
            this.currentBookmark = response.data && response.data.bookmark;
            console.log('created new currentBookmark for currentQuery: ' + this.currentBookmark);
          }, (err) => {
            //context.error = err;
            console.log('whoops...error...', err);
          });
        }

        var $modal = $('#bookmarkModal');

        $modal.modal('open');
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

    }, //methods

    watch: {
      locale: function(old_locale) {
        var self = this;
        $('#translatingModal').modal('open');
        console.log('locale changed: ' + old_locale);
        for(let k in this.messages) {
          //console.log('translating ' + k);
          this._t(k, this.messages);
        }

        setTimeout(function(){
          console.log(self.translate[self.getTranslationFieldName('bookmarkModalTitle')]);
          $('#translatingModal').modal('close');
        }, 9000);
      },

    },

  }

  //http://localhost:8080?q=04937836-d759-435f-a761-75e0efd0e291
  //http://localhost:8080?q=a59b23c7-14ba-4f24-a4c6-c8515214ba2d
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

  .bookmark-button {
    position: absolute;
    bottom: 50px;
    right: 20px;
  }

  .bookmark-button .btn-floating i {
    width: 25px;
  }

  /*  Generics  */
  .nhm-grey {
    color: #777;
  }
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
