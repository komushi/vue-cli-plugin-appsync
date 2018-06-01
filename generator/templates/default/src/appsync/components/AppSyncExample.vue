<template>
  <div class="app-sync-example">
    <h3>This is the AppSyncExample Component.</h3>
    <h4>One AWS AppSync API as the GraphQL server-side API is required for this example.</h4>
    <h4>Check the below links for AWS AppSync settings guide:</h4>
    <a href="https://github.com/komushi/vue-appsync-study" target="_blank">vue-appsync-study</a>
    <br/>
    <a href="https://github.com/komushi/vue-cli-plugin-appsync" target="_blank">vue-cli-plugin-appsync</a>


    <!-- Book example -->
    <ApolloQuery
      :query="require('../graphql/GetAllBooks.gql')"
    >
      <ApolloSubscribeToMore
        :document="require('../graphql/OnCreateBook.gql')"
        :update-query="onCreateBook"
      />

      <ApolloSubscribeToMore
        :document="require('../graphql/OnDeleteBook.gql')"
        :update-query="onDeleteBook"
      />

      <div slot-scope="{ result: { data } }">
        <template v-if="data">
          <table style="width:100%">
            <tr>
              <th></th>
              <th>Title</th>
              <th>Author</th>
              <th>Gender</th>
            </tr>
            <tr v-for="book of data.getAllBooks"
              :key="book.title"
              class="book">
              <td><button v-on:click="deleteBook(book.title)">😫Remove</button></td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.gender }}</td>
            </tr>
          </table>
        </template>
      </div>
    </ApolloQuery>

    <div class="form">
      <table style="width:100%">
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Gender</th>
        </tr>
        <tr>
          <td><input v-model="title" placeholder="title" class="input"></td>
          <td><input v-model="author" placeholder="author" class="input"></td>
          <td>
            <select v-model="gender">
              <option selected="selected" value="Male">Male</option>
              <option value="Female">Female</option>
            </select>            
          </td>
        </tr>
      </table>
      <button v-on:click="createBook">😄Add</button>
    </div>


  </div>
</template>

<script>
import MUTATION_CREATE_BOOK from '../graphql/CreateBook.gql'
import MUTATION_DELETE_BOOK from '../graphql/DeleteBook.gql'

export default {
  data () {
    return {
      title: '',
      author: '',
      gender: 'Male'
    }
  },

  computed: {
    formValid () {
      return ((this.title || this.title === "") && (this.author || this.author === "") && (this.gender || this.gender === ""))
    },
  },

  methods: {
    createBook: function() {

      const input = {
        title: this.title,
        gender: this.gender,
        author: this.author
      }

      if (this.formValid) {
        this.$apollo.mutate({
          mutation: MUTATION_CREATE_BOOK,
          variables: input
        })

        this.title = ''
        this.author = ''
      }
    },
    deleteBook: function(title) {
      const input = {
        title: title
      }

      this.$apollo.mutate({
        mutation: MUTATION_DELETE_BOOK,
        variables: input
      })
    },
    onCreateBook: function(previousResult, { subscriptionData }) {
      return {
        getAllBooks: [
          ...previousResult.getAllBooks,
          subscriptionData.data.onCreateBook
        ]
      }
    },
    onDeleteBook: function(previousResult, { subscriptionData }) {
      return {
        getAllBooks: previousResult.getAllBooks.filter(e => e.title !== subscriptionData.data.onDeleteBook.title)
      }
    }
  }
}
</script>

<style scoped>
.form,
.input,
.apollo,
.book {
  padding: 12px;
}

.app-sync-example{
  border:1px solid black;
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
