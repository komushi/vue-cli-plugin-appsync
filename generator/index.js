const chalk = require('chalk')

module.exports = (api, options, rootOptions) => {
  const pkg = {
    dependencies: {
      'aws-appsync': '^1.0.20',
      'graphql': '^0.13.2',
      'vue-apollo': '^3.0.0-beta.10',
    },
    devDependencies: {
      'graphql-tag': '^2.9.0',
      'eslint-plugin-graphql': '^2.1.0',
    },
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
      lines[lastImportIndex] += `\nimport { appSyncProvider } from './vue-appsync'`

      // Modify app
      const appIndex = lines.findIndex(line => line.match(/new Vue/))
      lines[appIndex] += `\n\tprovide: appSyncProvider.provide(),`

      content = lines.reverse().join('\n')
      fs.writeFileSync(mainPath, content, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your main file couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Modify App.vue
    try {
      const vuePath = api.resolve('./src/App.vue')

      let vueContent = fs.readFileSync(vuePath, { encoding: 'utf8' })

      const vueLines = vueContent.split(/\r?\n/g).reverse()

      // Inject import
      const vueLastImportIndex = vueLines.findIndex(line => line.match(/^import/))
      vueLines[vueLastImportIndex] += `\nimport AppSyncExample from './components/AppSyncExample.vue'`

      // Inject component
      const vueLastComponentIndex = vueLines.findIndex(line => line.match(`<div id="app">`))
      vueLines[vueLastComponentIndex] += `\n\t\t<app-sync-example></app-sync-example>`

      // Inject component reference
      const vueLastRefCompIndex = vueLines.findIndex(line => line.match('components: {'))
      vueLines[vueLastRefCompIndex] += `\n\t\tAppSyncExample,`

      vueContent = vueLines.reverse().join('\n')
      fs.writeFileSync(vuePath, vueContent, { encoding: 'utf8' })
    } catch (e) {
      api.exitLog(`Your main file couldn't be modified. You will have to edit the code yourself: https://github.com/komushi/vue-cli-plugin-appsync`, 'warn')
    }

    // Linting
    try {
      const lint = require('@vue/cli-plugin-eslint/lint')
      lint({ silent: true }, api)
    } catch (e) {
      // No ESLint vue-cli plugin
    }

    api.exitLog(`Please run ${chalk.red('awsmobile init --yes')} before using 'npm run serve or build'`, 'info')
  })
}
