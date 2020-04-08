import React, { Component } from 'react'
import { Transition } from 'react-transition-group'

class LazyBackground extends Component {
  constructor(props) {
    super(props)
    this.state = { src: null, loaded: false }
  }

  componentDidMount() {
    const { src } = this.props

    const imageLoader = new Image()
    imageLoader.src = src

    imageLoader.onload = () => {
      this.setState({ src, loaded: true })

      this.props.handleload()
    }
  }

  render() {
    let style = {
      backgroundImage: `url(${this.state.src})`
    }
    if (!this.state.loaded) {
      style = { ...style, opacity: 0 }
    } else {
      style = {...style, opacity: 0.5 }
    }
    if (this.props.getvisability() && this.state.loaded) {
      style = {...style, opacity: 0.5 }
    } else {
      style = {...style, opacity: 0 }
    }


    style.transition = `opacity 1s ease 0s`;

    return (
      <div style={{position: 'relative'}}>
        {this.props.children}
        <div style={{ backgroundColor: 'rgba(0,0,0,1)' }}>
          <div {...this.props} style={style}></div>
        </div>
      </div>
    )
  }
}

export default LazyBackground