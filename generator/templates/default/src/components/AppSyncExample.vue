<template>
  <div class="app-sync-example">

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
          <table style="width:100%">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Gender</th>
            </tr>
            <tr v-for="book of data.getAllBooks"
              :key="book.title"
              class="book">
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.gender }}</td>
            </tr>
          </table>
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

// export default {
//   data () {
//     return {
//       name: 'Anne',
//       newMessage: '',
//     }
//   },

//   computed: {
//     formValid () {
//       return this.newMessage
//     },
//   },

//   methods: {
//     sendMessage () {
//       if (this.formValid) {
//         this.$apollo.mutate({
//           mutation: MESSAGE_ADD_MUTATION,
//           variables: {
//             input: {
//               text: this.newMessage,
//             },
//           },
//         })

//         this.newMessage = ''
//       }
//     },

//     onMessageAdded (previousResult, { subscriptionData }) {
//       return {
//         messages: [
//           ...previousResult.messages,
//           subscriptionData.data.messageAdded,
//         ],
//       }
//     },
//   },
// }
</script>

<style scoped>
.form,
.input,
.apollo,
.book {
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
