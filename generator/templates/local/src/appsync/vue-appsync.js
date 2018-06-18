import Vue from 'vue';
import VueApollo from 'vue-apollo';
import AWSAppSyncClient from 'aws-appsync';
import awsmobile from '@/aws-exports';


import Amplify, { Auth, Logger } from 'aws-amplify';

// Initialize and Configure Amplify
Amplify.configure(awsmobile)

// Enable Logger
Amplify.Logger.LOG_LEVEL = 'DEBUG'
const logger = new Logger('main')
Auth.currentUserInfo()
  .then(user => logger.debug(user))
  .catch(err => logger.debug(err))


// Install the vue plugin
Vue.use(VueApollo);

// Config
const config = {
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: awsmobile.aws_appsync_authenticationType,
    apiKey: awsmobile.aws_appsync_apiKey,
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
  }
};

const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
};

// Create App Sync client
export const AppSyncClient = new AWSAppSyncClient(config, options);

// Create vue apollo provider
export const AppSyncProvider = new VueApollo({
  defaultClient: AppSyncClient
});
