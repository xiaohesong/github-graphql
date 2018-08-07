import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const MOVIES_QUERY = gql `
  {
    allMoviess {
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

class LinkList extends Component {
  render() {
    return (
      <Query query={MOVIES_QUERY}> 
        
        {
          ({data, loading, errors}) => {
            console.log('data is', data);
            
            if (loading) return <div>Fetching</div>
            if (errors) return <div>Error</div>
            
            const linksToRender = data.allMoviess
            console.log('count is', linksToRender.length);
            
            return (
              <div>
                {
                  linksToRender.map(link => <Link user={link.postedBy || {}} key={link.id} link={link} />)
                }
              </div>
            )
          }
        }
      </Query>
    )
  }
}

export default LinkList