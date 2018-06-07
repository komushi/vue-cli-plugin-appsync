const chalk = require('chalk')
const fs = require('fs')
const cmd = require('node-cmd')
const JsSearch = require('js-search')

let awsRegion

const getRegion = () => {
  return new Promise((resolve, reject) => {
    if (awsRegion) {
      resolve(awsRegion)
    } else {
      cmd.get('awsmobile configure aws -l', (err, data, stderr) => {
        if (err) {
          api.exitLog(`Your awsmobile configure couldn't be retrieved.`, 'warn')

          reject(err)
        } else {
          const awsmobileLines = data.split(/\r?\n/g)

          const index = awsmobileLines.findIndex(line => line.match(/region/))

          awsRegion = awsmobileLines[index].match(/'([^']+)'/)[1]

          resolve(awsRegion)
        }
      })
    }
  })
}

const deployBackend = () => {
  return new Promise((resolve, reject) => {
    cmd.get('awsmobile init --yes', (err, data, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const getBackendInfo = (api) => {
  return new Promise((resolve, reject) => {

    const path = api.resolve('./awsmobilejs/#current-backend-info/backend-details.json')

    let content = fs.readFileSync(path, { encoding: 'utf8' })
    contentObj = JSON.parse(content)
    
    const name = contentObj.name
    const region = contentObj.region

    const search = new JsSearch.Search('userpool')
    search.addIndex('type')
    search.addDocuments(contentObj.resources)
    const userPoolId = search.search('UserPool')[0].arn

    const backendInfo = {}
    backendInfo['userPoolId'] = userPoolId
    backendInfo['name'] = name
    backendInfo['awsRegion'] = region

    resolve(backendInfo)

  })
}

const writeGraphqlApi = (api, authenticationType, backendInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const path = api.resolve('./awsmobilejs/backend/appsync/graphqlApi.json')

      const contentObj = {}
      const userPoolConfig = {}

      userPoolConfig['userPoolId'] = backendInfo.userPoolId
      userPoolConfig['awsRegion'] = backendInfo.awsRegion
      userPoolConfig['defaultAction'] = 'ALLOW'

      contentObj['name'] = backendInfo.name
      contentObj['authenticationType'] = authenticationType
      contentObj['userPoolConfig'] = userPoolConfig

      fs.writeFileSync(path, JSON.stringify(contentObj), { encoding: 'utf8' })

      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

const updateBackend = () => {
  return new Promise((resolve, reject) => {
    cmd.run('awsmobile push', (err, data, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = (api, options, rootOptions) => {
  if (options.authenticationType === 'AMAZON_COGNITO_USER_POOLS') {
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

    // Modify main.js
    try {
      const tsPath = api.resolve('./src/main.ts')
      const jsPath = api.resolve('./src/main.js')

      const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath
      let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

      const lines = content.split(/\r?\n/g).reverse()

      // Inject import
      if (lines.findIndex(line => line.match(/import { AppSyncProvider }/)) === -1) {
        const lastImportIndex = lines.findIndex(line => line.match(/^import/))
        lines[lastImportIndex] += `\nimport { AppSyncProvider } from '@/appsync'`
      }

      // Modify app
      if (lines.findIndex(line => line.match(/AppSyncProvider.provide()/)) === -1) {
        const appIndex = lines.findIndex(line => line.match(/new Vue/))
        lines[appIndex] += `\n  provide: AppSyncProvider.provide(),`
      }

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
        if (vueLines.findIndex(line => line.match(/AppSync Example/)) === -1) {
          const vueLastRouterIndex = vueLines.findIndex(line => line.match(/<router-link/))
          vueLines[vueLastRouterIndex + 1] += `\n\t\t\t<router-link to="/appsync">AppSync Example</router-link> |`
        }

        vueContent = vueLines.reverse().join('\n')
        fs.writeFileSync(vuePath, vueContent, { encoding: 'utf8' })
      } catch (e) {
        api.exitLog(`Your App.vue couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
      }
    }

    // Modify router.js for AppSync Example
    if (options.addExample) {
      try {
        const routerPath = api.resolve('./src/router.js')

        let routerContent = fs.readFileSync(routerPath, { encoding: 'utf8' })

        const routerLines = routerContent.split(/\r?\n/g).reverse()

        if (routerLines.findIndex(line => line.match(/import { AppSyncRouter }/)) === -1) {
          // Inject import AppSync
          const lastImportIndex = routerLines.findIndex(line => line.match(/^import/))
          routerLines[lastImportIndex] += `\nimport { AppSyncRouter } from '@/appsync'`
        }

        if (routerLines.findIndex(line => line.match(/AppSyncRouter,/)) === -1) {
          // Inject route AppSync
          const firstRoutesIndex = routerLines.findIndex(line => line.match(/routes:/))
          routerLines[firstRoutesIndex] += `\n\t\tAppSyncRouter,`
        }

        routerContent = routerLines.reverse().join('\n')
        fs.writeFileSync(routerPath, routerContent, { encoding: 'utf8' })
      } catch (e) {
        api.exitLog(`Your router.js couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
      }
    }

    // Modify router.js for Cognito
    try {
      const routerPath = api.resolve('./src/router.js')

      let routerContent = fs.readFileSync(routerPath, { encoding: 'utf8' })

      const routerLines = routerContent.split(/\r?\n/g).reverse()

      if (options.authenticationType === 'AMAZON_COGNITO_USER_POOLS') {
        if (routerLines.findIndex(line => line.match(/AuthRouter,/)) === -1) {
          // Inject route AppSync
          const firstRoutesIndex = routerLines.findIndex(line => line.match(/routes:/))
          routerLines[firstRoutesIndex] += `\n\t\tAuthRouter,`
        }

        if (routerLines.findIndex(line => line.match(/import { AuthRouter, AuthFilter }/)) === -1) {
          // Inject import AppSync
          const lastImportIndex = routerLines.findIndex(line => line.match(/^import/))
          routerLines[lastImportIndex] += `\nimport { AuthRouter, AuthFilter } from '@/amplify'`
        }

        if (routerLines.findIndex(line => line.match(/^export default router/)) === -1) {
          // Inject export
          const exportIndex = routerLines.findIndex(line => line.match(/^export default/))
          routerLines[exportIndex] = `const router = new Router({`

          routerLines[0] += `\nrouter.beforeEach(AuthFilter)`
          routerLines[0] += `\n`
          routerLines[0] += `\nexport default router`
        }
      }

      routerContent = routerLines.reverse().join('\n')
      fs.writeFileSync(routerPath, routerContent, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your router.js couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Modify dataSources.json
    getRegion()
      .then((awsRegion) => {
        try {
          const dsPath = api.resolve('./awsmobilejs/backend/appsync/dataSources.json')

          let dsContent = fs.readFileSync(dsPath, { encoding: 'utf8' })

          const dsLines = dsContent.split(/\r?\n/g).reverse()

          // Replace awsRegion
          const awsRegionIndex = dsLines.findIndex(line => line.match(/"awsRegion"/))
          dsLines[awsRegionIndex] = `\t\t\t\t"awsRegion": "` + awsRegion + `",`

          // Replace Region
          const regionIndex = dsLines.findIndex(line => line.match(/"Region"/))
          dsLines[regionIndex] = `\t\t\t"Region": "` + awsRegion + `"`

          dsContent = dsLines.reverse().join('\n')
          fs.writeFileSync(dsPath, dsContent, { encoding: 'utf8' })
        } catch (e) {
          api.exitLog(`Your dataSources.json couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
        }
      });

    // Linting
    try {
      const lint = require('@vue/cli-plugin-eslint/lint')
      lint({ silent: true }, api)
    } catch (e) {
      // No ESLint vue-cli plugin
    }

    // Create Backends
    if (options.deployBackend) {
      api.exitLog(`Deploying Backend...`, 'info')
      api.exitLog(`Please run ${chalk.blue('awsmobile run')} or ${chalk.blue('npm run serve')} to start the vue application.`, 'info')

      if (options.authenticationType === 'AMAZON_COGNITO_USER_POOLS') {
        deployBackend()
          .then(() => {
            return getBackendInfo(api)
          })
          .then(backendInfo => { 
            return writeGraphqlApi(api, options.authenticationType, backendInfo)
          })
          .then(updateBackend)
      } else {
        deployBackend()
      }
    } else {
      api.exitLog(`Please run ${chalk.blue('awsmobile init --yes')} to deploy the backend.`, 'info')
    }
    
  })
}
