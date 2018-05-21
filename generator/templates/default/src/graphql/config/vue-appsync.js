import Vue from 'vue'
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from "aws-appsync"
import appSyncConfig from './AppSync'

// Install the vue plugin
Vue.use(VueApollo);

// Config
const config = {
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authenticationType,
    apiKey: appSyncConfig.apiKey,
  }
};

const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    }
  }
};

// Create App Sync client
export const appSyncClient = new AWSAppSyncClient(config, options);

// Create vue apollo provider
export const appSyncProvider = new VueApollo({
  defaultClient: appSyncClient
});