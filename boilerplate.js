/**
 * This file provides an `install` function that should install React Native,
 * copy over any folders and template files, and install any desired plugins.
 * 
 * It's a simpler version of the one found in https://github.com/infinitered/ignite-ir-boilerplate.
 * Refer to that one to see a more full featured example of what you can do.
 * 
 */

const REACT_NATIVE_VERSION = '0.57.4';
const { merge, pipe, assoc, omit, __ } = require('ramda');

/**
 * Let's install.
 *
 * @param {any} context - The gluegun context. Docs: https://infinitered.github.io/gluegun/#/context-api.md
 */

async function install (context) {
  const APP_PATH = process.cwd()
  const PLUGIN_PATH = __dirname

  const {
    filesystem,
    parameters,
    ignite,
    reactNative,
    print,
    system,
    template,
    prompt
  } = context

  const name = parameters.third
  const spinner = print
    .spin(`using the ${print.colors.cyan('Mobile')} boilerplate`)
    .succeed()

  // attempt to install React Native or die trying
  // this will also chdir into the new directory
  const rnInstall = await reactNative.install({ name, version: REACT_NATIVE_VERSION })
  if (rnInstall.exitCode > 0) { process.exit(rnInstall.exitCode) }

  const answer = await prompt.ask({
    type: 'confirm',
    name: 'lang',
    message: 'Do you want to add translation?',
    default: true
  });
  
  // copy our App & Tests directories
    spinner.text = '▸ copying files and remove old files'
    spinner.start()
  // choose lang support and copy files
    if(answer.lang) {
      filesystem.copy(`${PLUGIN_PATH}/boilerplate/src`, `${APP_PATH}/src`, {
        overwrite: true
      })
    } else {
      filesystem.copy(`${PLUGIN_PATH}/boilerplate/srcWoLang`, `${APP_PATH}/src`, {
        overwrite: true
      })
    }
    filesystem.copy(`${PLUGIN_PATH}/boilerplate/index.js`, `${APP_PATH}/index.js`, {
      overwrite: true
    })
    filesystem.copy(`${PLUGIN_PATH}/boilerplate/jest.config.js`, `${APP_PATH}/jest.config.js`, {
      overwrite: true
    })
    filesystem.copy(`${PLUGIN_PATH}/boilerplate/tsconfig.json`, `${APP_PATH}/tsconfig.json`, {
      overwrite: true
    })
  // remove RN basic files
    filesystem.remove('__tests__')
    filesystem.remove('App.js')
    spinner.stop()

    spinner.text = '▸ generating packageJSON'
    spinner.start()

    async function mergePackageJsons () {
      // transform our package.json in case we need to replace variables
      const rawJson = await template.generate({
        directory: `${ignite.ignitePluginPath()}/boilerplate`,
        template: 'package.json.ejs',
      })
      const newPackageJson = JSON.parse(rawJson)

      // read in the react-native created package.json
      const currentPackage = filesystem.read('package.json', 'json')
      
      // deep merge, lol
      const newPackage = pipe(
        assoc(
          'dependencies',
          merge(currentPackage.dependencies, newPackageJson.dependencies)
        ),
        assoc('scripts', merge(currentPackage.scripts, newPackageJson.scripts)),
        merge(
          __,
          omit(['dependencies', 'scripts'], newPackageJson)
        )
      )(currentPackage)

      // write this out
      filesystem.write('package.json', newPackage, { jsonIndent: 2 })
    }
    await mergePackageJsons()

    spinner.stop()

    // generate some templates
    spinner.text = '▸ generating files'
    spinner.start()
    const templates = [
      { template: 'ignite/ignite.json', target: 'ignite/ignite.json' },
      { template: 'index.js', target: 'index.js' }
    ]
    await ignite.copyBatch(context, templates, { name: name }, {
      quiet: true,
      directory: `${PLUGIN_PATH}/boilerplate`
    })
    spinner.stop()

    // run npm install
    spinner.text = '▸ installing ignite dependencies'
    spinner.start()
    await system.run('npm i')
    spinner.stop()

    // react native link -- must use spawn & stdio: ignore or it hangs!! :(
    spinner.text = `▸ linking native libraries`
    spinner.start()
    await system.spawn('react-native link', { stdio: 'ignore' })
    spinner.stop()

    // install any plugins, including ourselves if we have generators.
    // please note you should always do `stdio: 'inherit'` or it'll hang
    
    try {
      // pass along the debug flag if we're running in that mode
      const debugFlag = parameters.options.debug ? '--debug' : ''

      await system.spawn(`ignite add ${__dirname} ${debugFlag}`, { stdio: 'inherit' })

      // example of another plugin you could install
      // await system.spawn(`ignite add i18n ${debugFlag}`, { stdio: 'inherit' })
    } catch (e) {
      ignite.log(e)
      throw e
    }

    // initialize git
    const gitExists = await filesystem.exists('.git')
    if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
      spinner.text = 'setting up git'
      spinner.start()
      await system.run('git init . && git add . && git commit -m "Initial commit."')
      spinner.succeed()
    }

    // Wrap it up with our success message.
    print.info('')
    print.info('🍽 Lets start!')
    print.info('')
    print.info(print.colors.yellow(`  cd ${name}`))
    print.info(print.colors.yellow('  react-native run-ios'))
    print.info(print.colors.yellow('  react-native run-android'))
    print.info('')
}

module.exports = { install }
