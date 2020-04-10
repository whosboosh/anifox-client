import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import VizSensor from 'react-visibility-sensor';
import LazyBackground from './LazyBackground'
import { Animate } from 'react-animate-mount'

const styles = theme => ({
  image: {
    height: '242px',
    width: '167px',
  },
  anime: {
    display: 'flex',
    'flex-wrap': 'wrap',
    'flex-direction': 'column',
    'justify-content': 'flex-start',
    height: 'auto',
    width: '167px',
    margin: '5px 5px 5px 5px',
  },
  text: {
    color: 'white',
    position: 'absolute',
    margin: '0 0 10px 5px',
    fontSize: '12px',
    bottom: 0,
    zIndex: 1
  }
})

class Title extends Component {
  constructor(props) {
    super(props)
    this.state = {hasLoaded: false, imgViz: false}
    this.handleLoad = this.handleLoad.bind(this)
    this.getVisability = this.getVisability.bind(this)
  }

  handleClick(malID, e) {
    this.props.handleClick(malID, e)
  }

  handleLoad() {
    this.setState({ hasLoaded: true })
  }

  getVisability() {
    return this.state.imgViz
  }

  render() {
    const { title, picture, malID, key } = this.props.value
    const { classes } = this.props

    return (
      <VizSensor
        partialVisibility
        onChange={(isVisible) => {
          this.setState({ imgViz: isVisible})
        }}
      >
        <div
          className={`${classes.anime}`}
          onClick={(e) => this.handleClick(malID, e)}
        >
          {this.state.imgViz || this.state.hasLoaded ?
              <LazyBackground key={key}
                src={picture}
                handleload={this.handleLoad}
                getvisability={this.getVisability}
              >
                <span className={`${classes.text}`}>{title}</span>
              </LazyBackground>
          : <div className={`${classes.image}`}></div>
          }
        </div>
      </VizSensor>
    )
  }
}

export default withStyles(styles)(Title)
