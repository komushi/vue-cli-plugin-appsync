const chalk = require('chalk')

module.exports = (api, options, rootOptions) => {
  let pkg

  if (options.authType === 'AMAZON_COGNITO_USER_POOLS') {
    pkg = {
      dependencies: {
        'aws-amplify': '^0.4.1',
        'aws-appsync': '^1.0.20',
        'graphql': '^0.13.2',
        'vue-apollo': '^3.0.0-beta.10',
        'vue-router': '^3.0.1',
        'vuex': '^3.0.1',
      },
      devDependencies: {
        'graphql-tag': '^2.9.0',
        'eslint-plugin-graphql': '^2.1.0',
      },
    }
  } else {
    pkg = {
      dependencies: {
        'aws-amplify': '^0.4.1',
        'aws-appsync': '^1.0.20',
        'graphql': '^0.13.2',
        'vue-apollo': '^3.0.0-beta.10',
        'vue-router': '^3.0.1',
      },
      devDependencies: {
        'graphql-tag': '^2.9.0',
        'eslint-plugin-graphql': '^2.1.0',
      },
    }
  }

  api.extendPackage(pkg)

  api.render('./templates/default', {
    ...options,
  })

  api.onCreateComplete(() => {
    const fs = require('fs')

    // Modify main.js
    try {
      const tsPath = api.resolve('./src/main.ts')
      const jsPath = api.resolve('./src/main.js')

      const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath
      let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

      const lines = content.split(/\r?\n/g).reverse()

      // Inject import
      const lastImportIndex = lines.findIndex(line => line.match(/^import/))
      lines[lastImportIndex] += `\nimport { AppSyncRouter } from '@/appsync'`

      // Modify app
      const appIndex = lines.findIndex(line => line.match(/new Vue/))
      lines[appIndex] += `\n  provide: AppSyncRouter.provide(),`

      content = lines.reverse().join('\n')
      fs.writeFileSync(mainPath, content, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your main.js couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Modify App.vue
    if (options.addExample) {
      try {
        const vuePath = api.resolve('./src/App.vue')

        let vueContent = fs.readFileSync(vuePath, { encoding: 'utf8' })

        const vueLines = vueContent.split(/\r?\n/g).reverse()

        // Inject router-link
        const vueLastRouterIndex = vueLines.findIndex(line => line.match(/<router-link/))
        vueLines[vueLastRouterIndex + 1] += `\n\t\t\t<router-link to="/appsync">AppSync Example</router-link> |`

        vueContent = vueLines.reverse().join('\n')
        fs.writeFileSync(vuePath, vueContent, { encoding: 'utf8' })
      } catch (e) {
        api.exitLog(`Your App.vue couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
      }
    }

    // Modify router.js
    try {
      const routerPath = api.resolve('./src/router.js')

      let routerContent = fs.readFileSync(routerPath, { encoding: 'utf8' })

      const routerLines = routerContent.split(/\r?\n/g).reverse()

      // Inject import AppSync
      const lastImportIndex = routerLines.findIndex(line => line.match(/^import/))
      routerLines[lastImportIndex] += `\nimport { AppSyncRouter } from '@/appsync'`

      // Inject import Cognito
      if (options.authType === 'AMAZON_COGNITO_USER_POOLS') {
        routerLines[lastImportIndex] += `\nimport { AuthRouter, AuthFilter } from '@/amplify'`
      }

      // Inject route AppSync
      const firstRoutesIndex = routerLines.findIndex(line => line.match(/\s\broutes/))
      routerLines[firstRoutesIndex - 1] += `\n\t\t\tAppSyncRouter,`

      // Inject route Cognito
      if (options.authType === 'AMAZON_COGNITO_USER_POOLS') {
        routerLines[firstRoutesIndex - 1] += `\n\t\t\tAuthRouter,`
      }

      routerContent = routerLines.reverse().join('\n')
      fs.writeFileSync(routerPath, routerContent, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your router.js couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Modify graphqlApi.json
    if (options.authType === 'AMAZON_COGNITO_USER_POOLS') {
      try {
        const gqlPath = api.resolve('./awsmobilejs/backend/appsync/graphqlApi.json')

        let gqlContent = fs.readFileSync(gqlPath, { encoding: 'utf8' })

        const gqlLines = gqlContent.split(/\r?\n/g).reverse()

        // Inject router-link
        const authIndex = gqlLines.findIndex(line => line.match(/"authenticationType/))
        gqlLines[authIndex] = `\t"authenticationType": "AMAZON_COGNITO_USER_POOLS"`

        gqlContent = gqlLines.reverse().join('\n')
        fs.writeFileSync(gqlPath, gqlContent, { encoding: 'utf8' })
      } catch (e) {
        api.exitLog(`Your graphqlApi.json couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
      }
    }

    // Linting
    try {
      const lint = require('@vue/cli-plugin-eslint/lint')
      lint({ silent: true }, api)
    } catch (e) {
      // No ESLint vue-cli plugin
    }

    api.exitLog(`Please run ${chalk.red('awsmobile init --yes')} before using 'awsmobile run'`, 'info')
  })
}
