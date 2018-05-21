<template>
  <div class="apollo-example">

    <!-- Book example -->
    <ApolloQuery
      :query="require('../graphql/queries/GetAllBooks.gql')"
    >
<!--       <ApolloSubscribeToMore
        :document="require('../graphql/MessageAdded.gql')"
        :update-query="onMessageAdded"
      /> -->

      <div slot-scope="{ result: { data } }">
        <template v-if="data">
          <div
            v-for="book of data.getAllBooks"
            :key="book.title"
            class="message"
          >
            {{ book.title }}
          </div>
        </template>
      </div>
    </ApolloQuery>

<!--     <div class="form">
      <input
        v-model="newMessage"
        placeholder="Type a message"
        class="input"
        @keyup.enter="sendMessage"
      >
    </div> -->
  </div>
</template>

<script>
// import MESSAGE_ADD_MUTATION from '../graphql/MessageAdd.gql'

export default {
  data () {
    return {
      name: 'Anne',
      newMessage: '',
    }
  },

  computed: {
    formValid () {
      return this.newMessage
    },
  },

  methods: {
    sendMessage () {
      if (this.formValid) {
        this.$apollo.mutate({
          mutation: MESSAGE_ADD_MUTATION,
          variables: {
            input: {
              text: this.newMessage,
            },
          },
        })

        this.newMessage = ''
      }
    },

    onMessageAdded (previousResult, { subscriptionData }) {
      return {
        messages: [
          ...previousResult.messages,
          subscriptionData.data.messageAdded,
        ],
      }
    },
  },
}
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}
</style>
