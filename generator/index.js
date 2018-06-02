const chalk = require('chalk')
const cmd = require('node-cmd')

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
      lines[lastImportIndex] += `\nimport { AppSyncProvider } from '@/appsync'`

      // Modify app
      const appIndex = lines.findIndex(line => line.match(/new Vue/))
      lines[appIndex] += `\n  provide: AppSyncProvider.provide(),`

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
      routerLines[firstRoutesIndex] += `\n\t\tAppSyncRouter,`

      // Inject route Cognito
      if (options.authType === 'AMAZON_COGNITO_USER_POOLS') {
        routerLines[firstRoutesIndex] += `\n\t\tAuthRouter,`
      }

      // Inject export
      const exportIndex = routerLines.findIndex(line => line.match(/^export default/))
      routerLines[exportIndex] = `const router = new Router({`

      if (options.authType === 'AMAZON_COGNITO_USER_POOLS') {
        routerLines[0] += `\nrouter.beforeEach(AuthFilter)`
      }

      routerLines[0] += `\n`

      routerLines[0] += `\nexport default router`

      routerContent = routerLines.reverse().join('\n')
      fs.writeFileSync(routerPath, routerContent, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your router.js couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Modify graphqlApi.json
    try {
      const gqlPath = api.resolve('./awsmobilejs/backend/appsync/graphqlApi.json')

      let gqlContent = fs.readFileSync(gqlPath, { encoding: 'utf8' })

      const gqlLines = gqlContent.split(/\r?\n/g).reverse()

      // Inject router-link
      const authIndex = gqlLines.findIndex(line => line.match(/"authenticationType/))
      gqlLines[authIndex] = `\t"authenticationType": "` + options.authType + `"`

      gqlContent = gqlLines.reverse().join('\n')
      fs.writeFileSync(gqlPath, gqlContent, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your graphqlApi.json couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Modify dataSources.json
    cmd.get('awsmobile configure aws -l', (err, data, stderr) => {
      if (err) {
        api.exitLog(`Your awsmobile configure couldn't be retrieved.`, 'warn')
      } else {
        const awsmobileLines = data.split(/\r?\n/g)

        const index = awsmobileLines.findIndex(line => line.match(/region/))

        let awsRegion = awsmobileLines[index].match(/'([^']+)'/)[1]

        try {
          const dsPath = api.resolve('./awsmobilejs/backend/appsync/dataSources.json')

          let dsContent = fs.readFileSync(dsPath, { encoding: 'utf8' })

          const dsLines = dsContent.split(/\r?\n/g).reverse()

          // Replace awsRegion
          const awsRegionIndex = dsLines.findIndex(line => line.match(/"awsRegion"/))
          dsLines[awsRegionIndex] = `\t\t\t\t"awsRegion": "` + awsRegion + `",`

          // Replace Region
          const regionIndex = dsLines.findIndex(line => line.match(/"Region"/))
          dsLines[regionIndex] = `\t\t\t"Region": "` + awsRegion + `",`

          dsContent = dsLines.reverse().join('\n')
          fs.writeFileSync(dsPath, dsContent, { encoding: 'utf8' })
        } catch (e) {
          api.exitLog(`Your dataSources.json couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
        }
      }
    })

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
