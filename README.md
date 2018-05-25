# vue-cli-plugin-appsync

**:rocket: Build a Vue app with AppSync and GraphQL in minutes!**

This is a vue-cli 3.x plugin to add AppSync and GraphQL in your Vue project.

## 1. Getting started

### 1-1. Check vue-cli version
:warning: Make sure you have vue-cli 3.x.x:

```
vue --version
```

### 1-2. Check AWS Mobile CLI version:
:warning: Make sure you have awsmobile-cli 1.1.x:

```
awsmobile -V
```

### 1-3. Create a vue project
If you don't have a project created with vue-cli 3.x yet:

```
vue create my-new-app
```

### 1-4. Apply the AppSync plugin
Navigate to the newly created project folder and add the cli plugin:

```
cd my-new-app
vue add appsync
```

### 1-5. Setup AWS AppSync API 

**:information_source: An example `AppSyncExample.vue` component alongside some GraphQL query and setting files will be added into your sources. To make the example work you need to setup one AWS AppSync API as the GraphQL server-side API.**

[**A guide to setup one AWS AppSync API as the GraphQL server-side API**](https://github.com/komushi/vue-appsync-study#2-manually-setup-aws-appsync-graphql-api-server-side-with-aws-management-console)

**Or setup it by using AWS Mobile CLI**
```
awsmobile init --yes
```

### 1-6. Start your app

```
npm run serve
```

*Or if you use awsmobile*

```
awsmobile run
```

## 2. Plugin process
**For people who want to know how the plugin works.**

### 2-1. Injected webpack-chain Rules by vue-cli-service

- `config.rule('gql')`

### 2-2. Added files in generator template
* AppSyncExample.js -> src/components/AppSyncExample.js
* vue-appsync.js -> src/vue-appsync.js
* GetAllBooks.gql -> src/graphql/GetAllBooks.gql
* CreateBook.gql -> src/graphql/CreateBook.gql
* DeleteBook.gql -> src/graphql/DeleteBook.gql
* OnCreateBook.gql -> src/graphql/OnCreateBook.gql
* OnDeleteBook.gql -> src/graphql/OnDeleteBook.gql
* Folder awsmobilejs -> awsmobilejs

### 2-3. Modified files by generator
#### 2-3-1. src/main.js
<pre>
import Vue from 'vue'
import App from './App.vue'
<b>import { appSyncProvider } from './vue-appsync'</b>

Vue.config.productionTip = false

new Vue({
    <b>provide: appSyncProvider.provide(),</b>
    render: h => h(App)
}).$mount('#app')
</pre>

#### 2-3-2. src/App.vue
```
<template>
  <div id="app">
    <app-sync-example></app-sync-example>
    <img src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppSyncExample from './components/AppSyncExample.vue'</script>

export default {
  name: 'app',
  components: {
    HelloWorld,
    ApolloExample
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
```

## 3. Plugin TODOs
* More AWS AppSync authentication types support: AWS_IAM, Cognito, OpenID.
* Better approach to integrate with AWS Amplify(awsmobile).