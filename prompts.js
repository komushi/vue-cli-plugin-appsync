module.exports = [
  {
    type: 'confirm',
    name: 'addExample',
    message: 'Add an AppSync Example page?',
    default: true,
  },
  {
    type: 'list',
    name: 'datasourceType',
    message: 'What is the datasource type?',
    choices: ['AMAZON_DYNAMODB', 'NONE'],
    // choices: ['NONE', 'AMAZON_DYNAMODB' 'AMAZON_ELASTICSEARCH', 'AWS_LAMBDA'],
    when: answers => answers.addExample,
  },
  {
    type: 'list',
    name: 'authenticationType',
    message: 'What is the authentication type?',
    choices: ['API_KEY', 'AMAZON_COGNITO_USER_POOLS'],
  },
  {
    type: 'confirm',
    name: 'deployBackend',
    message: 'Deploy the AWS AppSync and AWS Mobile Hub Backends?',
    default: true,
  },
]
