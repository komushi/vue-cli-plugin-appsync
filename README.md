# vue-cli-plugin-appsync

**:rocket: Start building a Vue app with AppSync and GraphQL in 1 minute!**

This is a vue-cli 3.x plugin to add AppSync and GraphQL in your Vue project.

## Getting started

:warning: Make sure you have vue-cli 3.x.x:

```
vue --version
```

If you don't have a project created with vue-cli 3.x yet:

```
vue create my-new-app
```

Navigate to the newly created project folder and add the cli plugin:

```
cd my-new-app
vue add appsync
```

*:information_source: An example `AppSyncExample.vue` component alongside some GraphQL query and setting files will be added into your sources.*

Start your app:

```
npm run serve
```

## Injected webpack-chain Rules

- `config.rule('gql')`
