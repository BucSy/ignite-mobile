// Generates a "selector".

module.exports = async function (context) {
    // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
    const { parameters, strings, print, ignite, prompt } = context
    const { camelCase, pascalCase, isBlank } = strings
    let name, props, answer, jobs;
  
    // validation
    if (isBlank(parameters.first)) {
      print.info(`ignite generate selector <name>\n`)
      print.info('A name is required.')
      return
    }
  
    // ask user to choose camelCase or PascalCase
    answer = await prompt.ask({
      type: 'list',
      name: 'lang',
      message: 'What naming convention do you want to use?',
      choices: [
        'camelCase',
        'PascalCase'
      ]
    });
    
    if(answer.lang === 'camelCase') {
      name = camelCase(parameters.first)
      props = { name }
    } else {
      name = pascalCase(parameters.first)
      props = { name }
    }
  
    // Copies the `selector.js.ejs` in your plugin's templates folder
    // into ./${name}.js.
    jobs = [{
      template: 'reducer.js.ejs',
      target: `${name}.ts`
    }]
  
    // make the templates and pass in props with the third argument here
    await ignite.copyBatch(context, jobs, props)
  }