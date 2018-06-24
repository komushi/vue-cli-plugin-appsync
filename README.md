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

### 1-3. Configure AWS Mobile CLI:
**Choose your region**

```
$awsmobile configure aws

configure aws
? accessKeyId:  <accessKeyId>
? secretAccessKey:  <secretAccessKey>
? region:  ap-northeast-1
```


### 1-4. Create a vue project
Create a project with vue-cli 3.x:
**Use Babel, Router, Linter with default settings**
```
vue create my-new-app

Vue CLI v3.0.0-beta.15
? Please pick a preset: Manually select features
? Check the features needed for your project: 
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
❯◉ Router
 ◯ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

### 1-5. Apply the AppSync plugin
Navigate to the newly created project folder and add the cli plugin:
**With the options below a backend with AppSync + Cognito and a frontend website on S3 and CloudFront will be deployed.**
**Your default browser will be started to the hosted website.**

```
cd my-new-app
vue add appsync

? Add an AppSync Example page? Yes
? What is the datasource type? AMAZON_DYNAMODB
? What is the authentication type? AMAZON_COGNITO_USER_POOLS
? Deploy the AWS AppSync and AWS Mobile Hub Backends? Yes
? Publish the production distribution to AWS S3 and CloudFront? Yes
```

### 1-6. Setup AWS AppSync API 
**Skip this step if you already chose yes for 'Deploy the AWS AppSync and AWS Mobile Hub Backends?'**

**:information_source: An example `AppSyncExample.vue` component alongside some GraphQL query and setting files will be added into your sources. To make the example work you need to setup one AWS AppSync API as the GraphQL server-side API.**

[**A guide to setup one AWS AppSync API as the GraphQL server-side API**](https://github.com/komushi/vue-appsync-study#2-manually-setup-aws-appsync-graphql-api-server-side-with-aws-management-console)

**Or setup it by using AWS Mobile CLI**
```
awsmobile init --yes
```

### 1-7. Start your app
**Skip this step if you already chose yes for 'Publish the production distribution to AWS S3 and CloudFront?'**

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
* Folder amplify -> src/amplify
* Folder awsmobilejs -> src/awsmobilejs

### 2-3. Modified files by generator
#### 2-3-1. src/main.js
```
import Vue from 'vue'
import App from './App.vue'
import { AppSyncProvider } from '@/appsync'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router: router,
  provide: AppSyncProvider.provide(),
  render: h => h(App)
}).$mount('#app')
```

#### 2-3-2. src/App.vue
```
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/appsync">AppSync Example</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
```

#### 2-3-3. src/router.js
```
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import { AppSyncRouter } from '@/appsync'
import { AuthRouter, AuthFilter } from '@/amplify'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    AppSyncRouter,
    AuthRouter
  ]
})

router.beforeEach(AuthFilter);

export default router
```

#### 2-3-4. awsmobilejs/backend/appsync/graphqlApi.json
**authenticationType**

#### 2-3-5. awsmobilejs/backend/appsync/dataSources.json
**awsRegion & Region**

## 3. Plugin TODOs
* More AWS AppSync authentication types support: OpenID
* More Resolver types support: Lambda, ElasticSearch
