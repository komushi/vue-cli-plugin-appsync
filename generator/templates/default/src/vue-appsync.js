import Vue from 'vue'
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'
import awsmobile from './aws-exports'

// Install the vue plugin
Vue.use(VueApollo);

// Config
const config = {
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: awsmobile.aws_appsync_authenticationType,
    apiKey: awsmobile.aws_appsync_apiKey,
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
