# vue-cli-plugin-appsync

**:rocket: Start building a Vue app with AppSync and GraphQL in 1 minute!**

This is a vue-cli 3.x plugin to add AppSync and GraphQL in your Vue project.

## 1. Getting started

### 1-1. Check vue-cli version
:warning: Make sure you have vue-cli 3.x.x:

```
vue --version
```

### 1-2. Create vue a project
If you don't have a project created with vue-cli 3.x yet:

```
vue create my-new-app
```

### 1-3. App the appsync plugin
Navigate to the newly created project folder and add the cli plugin:

```
cd my-new-app
vue add appsync
```

*:information_source: An example `AppSyncExample.vue` component alongside some GraphQL query and setting files will be added into your sources.*

### 1-4. Modify AppSync.js

Download AppSync.js for Web from AWS AppSync Management Console:
Overwrite src/graphql/config/AppSync.js
```
export default {
    "graphqlEndpoint": "https://1234567890.appsync-api.ap-northeast-1.amazonaws.com/graphql",
    "region": "ap-northeast-1",
    "authenticationType": "API_KEY",
    "apiKey": "apikey1234567890"
}
```


### 1-2. Start your app

```
npm run serve
```

## 2. Plugin process
### 2-1. Injected webpack-chain Rules

- `config.rule('gql')`
