<template>
  <div class="app-sync-example">
    <h2>AppSync Client with Local Resolvers</h2>
    <h3>This frame is the scope of the AppSyncExample Component.</h3>
    <h4>One AWS AppSync API as the GraphQL server-side API is required for this example.</h4>
    <h4>Check the below links for AWS AppSync settings guide:</h4>
    <a href="https://github.com/komushi/vue-appsync-study" target="_blank">vue-appsync-study</a>
    <br/>
    <a href="https://github.com/komushi/vue-cli-plugin-appsync" target="_blank">vue-cli-plugin-appsync</a>

    <div>
      <table style="width:100%">
        <tr>
          <th>Status</th>
          <th>Title</th>
          <th>Author</th>
          <th>Gender</th>
        </tr>
        <tr v-for="book in books"
          :key="book.title"
          class="book">
          <td>{{ book.status }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.gender }}</td>
        </tr>
      </table>
    </div>

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
      <button v-on:click="deleteBook">😫Delete</button>
    </div>


  </div>
</template>

<script>
import MUTATION_CREATE_BOOK from '../graphql/CreateBook.gql'
import MUTATION_DELETE_BOOK from '../graphql/DeleteBook.gql'
import SUBSCRIPTION_ON_CREATE_BOOK from '../graphql/OnCreateBook.gql'
import SUBSCRIPTION_ON_DELETE_BOOK from '../graphql/OnDeleteBook.gql'

export default {
  data () {
    return {
      title: '',
      author: '',
      gender: 'Male',
      books: []
    }
  },

  mounted () {
    this.subscribeOnCreateBook(this)

    this.subscribeOnDeleteBook(this)
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
          variables: input,
          optimisticResponse: {
            __typename: 'Mutation',
            createBook: {
              __typename: 'Book',
              title: input.title,
              gender: input.gender,
              author: input.author
            },
          }
        })

        this.title = ''
        this.author = ''
      }
    },
    deleteBook: function() {
      const input = {
        title: this.title
      }

      this.$apollo.mutate({
        mutation: MUTATION_DELETE_BOOK,
        variables: input,
        optimisticResponse: {
          __typename: 'Mutation',
          deleteBook: {
            __typename: 'Book',
            title: input.title
          },
        }
      })

      this.title = ''
      this.author = ''
    },
    subscribeOnCreateBook: (vm) => {
      const observer = vm.$apollo.subscribe({
        query: SUBSCRIPTION_ON_CREATE_BOOK,
      })

      observer.subscribe({
        next(newBook) {
          let notified = newBook.data.onCreateBook
          notified.status = "😄Added"
          vm.books.push(notified)
        },
      })
    },
    subscribeOnDeleteBook: (vm) => {
      const observer = vm.$apollo.subscribe({
        query: SUBSCRIPTION_ON_DELETE_BOOK,
      })

      observer.subscribe({
        next(deletedBook) {
          let notified = deletedBook.data.onDeleteBook
          notified.status = "😫Deleted"
          vm.books.push(notified)
        },
      })
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
