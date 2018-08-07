import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const POST_MUTATION = gql `
  mutation ($description: String!, $title: String!) {
    createMovie(description: $description, title: $title) {
      id
      title
      description
      postedBy {
        id
        name
        email
      }
    }
  }
`

class CreateLink extends Component {
  state = {
    description: '',
    title: '',
  }

  render() {
    const { description, title } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the movie"
          />
          <input
            className="mb2"
            value={title}
            onChange={e => this.setState({ title: e.target.value })}
            type="text"
            placeholder = "The Title for the movie"
          />
        </div>
        <Mutation mutation={POST_MUTATION} variables={{ description, title }}>
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreateLink