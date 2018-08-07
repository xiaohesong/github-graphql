import React, { Component } from 'react'

class Link extends Component {
  render() {
    const {link, user} = this.props
    return (
      <div>
        <div>
          {link.id} - {user.name} Created Movie - {link.title} - {link.description}
        </div>
      </div>
    )
  }
}

export default Link