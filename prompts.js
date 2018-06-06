module.exports = [
  {
    type: 'confirm',
    name: 'addExample',
    message: 'Add an AppSync Example page?',
    default: true,
  },
  {
    type: 'list',
    name: 'authenticationType',
    message: 'What is the authentication type?',
    choices: ['API_KEY', 'AMAZON_COGNITO_USER_POOLS'],
    when: answers => answers.addExample,
  },
  {
    type: 'confirm',
    name: 'createBackend',
    message: 'Create the AWS AppSync and AWS Mobile Hub Backends?',
    default: true,
  },
]
