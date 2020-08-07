const { dockStart } = require('@nlpjs/basic')

let mBot = async (message) => {

  nlp = await getNLP()
  // await nlp.train()
  let response = await nlp.process('en', message)
  return {
    intent : response['intent'],
    text: response['answer']
  }
}
let getNLP = async() => {
  const dock = await dockStart({ use: ['Basic']})
  const nlp = dock.get('nlp')
  nlp.addLanguage('en')
  await nlp.addCorpus('./src/corpus/corpus-en.json')
  return nlp
}
module.exports = {mBot,getNLP}