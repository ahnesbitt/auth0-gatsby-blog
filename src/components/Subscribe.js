import React from 'react'
import axios from 'axios'

const wtUri = '<your webtask uri>'

export default class Subscribe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subscribed: this.isSubscribed(),
    }
  }

  isSubscribed() {
    return localStorage.getItem('subscribed') == 'true'
  }

  isIdentified() {
    return this.props.auth.getUser() && this.props.auth.isAuthenticated()
  }

  componentDidMount() {
    if (this.isIdentified() && localStorage.getItem('subscribed') === null) {
      const token = this.props.auth.accessToken
      axios
        .get(`${wtUri}/subscribed`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          localStorage.setItem('subscribed', res.data.status == 'subscribed')
          this.setState({
            subscribed: this.isSubscribed(),
          })
        })
        .catch(console.error)
    }
  }

  subscribe() {
    if (this.isIdentified()) {
      const token = this.props.auth.accessToken
      axios
        .get(`${wtUri}/subscribe`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          localStorage.setItem('subscribed', 'true')
          this.setState({
            subscribed: this.isSubscribed(),
          })
        })
        .catch(console.error)
    }
  }

  unsubscribe() {
    if (this.isIdentified()) {
      const token = this.props.auth.accessToken
      axios
        .get(`${wtUri}/unsubscribe`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          localStorage.removeItem('subscribed')
          this.setState({
            subscribed: false,
          })
        })
        .catch(console.error)
    }
  }

  render() {
    if (this.state.subscribed) {
      return (
        <a href="#" onClick={this.unsubscribe.bind(this)}>
          Unsubscribe
        </a>
      )
    } else {
      return (
        <a href="#" onClick={this.subscribe.bind(this)}>
          Subscribe
        </a>
      )
    }
  }
}
