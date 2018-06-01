module.exports = [
  {
    type: 'confirm',
    name: 'addExample',
    message: 'Add an AppSync Example page?',
    default: true,
  },
  {
    type: 'list',
    name: 'authType',
    message: 'What is the authentication type?',
    choices: ['API_KEY', 'AMAZON_COGNITO_USER_POOLS'],
  },
]
