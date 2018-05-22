# vue-cli-plugin-appsync

**:rocket: Build a Vue app with AppSync and GraphQL in minutes!**

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

### 1-3. Apply the AppSync plugin
Navigate to the newly created project folder and add the cli plugin:

```
cd my-new-app
vue add appsync
```

**:information_source: An example `AppSyncExample.vue` component alongside some GraphQL query and setting files will be added into your sources. To make the example work you need to setup one AWS AppSync API as the GraphQL server-side API.**

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


### 1-5. Start your app

```
npm run serve
```

## 2. Plugin process
**For people who want to know how the plugin works.**

### 2-1. Injected webpack-chain Rules by vue-cli-service

- `config.rule('gql')`

### 2-2. Added files in generator template
* AppSyncExample.js -> src/components/AppSyncExample.js
* AppSync.js -> src/graphql/config/AppSync.js
* vue-appsync.js -> src/graphql/config/vue-appsync.js
* GetAllBooks.gql -> src/graphql/queries/GetAllBooks.gql
* CreateBook.gql -> src/graphql/queries/CreateBook.gql
* DeleteBook.gql -> src/graphql/queries/DeleteBook.gql
* OnCreateBook.gql -> src/graphql/queries/OnCreateBook.gql
* OnDeleteBook.gql -> src/graphql/queries/OnDeleteBook.gql


### 2-3. Modified files by generator
* src/main.js
<pre>
import Vue from 'vue'
import App from './App.vue'
<b>import { appSyncProvider } from './graphql/vue-appsync'</b>

Vue.config.productionTip = false

new Vue({
    <b>provide: appSyncProvider.provide(),</b>
    render: h => h(App)
}).$mount('#app')
</pre>

* src/App.vue

```html
<template>
  <div id="app">
    <app-sync-example></app-sync-example>
    <img src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>
```

<pre><code>
<script>
import HelloWorld from './components/HelloWorld.vue'
<b>import AppSyncExample from './components/AppSyncExample.vue'</script></b>

export default {
  name: 'app',
  components: {
    HelloWorld,
    <b>ApolloExample</b>
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
</code></pre>
