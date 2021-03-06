import { Clock } from 'three'
import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {
  constructor() {
    // Get parent methods
    super()

    // Set up
    this.clock = new Clock(true)
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    this.tick = this.tick.bind(this)
    this.tick()
  }
  // on('tick')
  tick() {
    // Call tick method on each frame
    this.ticker = requestAnimationFrame(this.tick)

    // Get current time
    const current = Date.now()

    // delta
    this.delta = current - this.current
    // elapsed = time between start and now
    this.elapsed = current - this.start
    // current = current time
    this.current = current

    // fluid on < 60Hz
    if (this.delta > 1 / 60 * 1000) {
      this.delta = 1 / 60 * 1000
    }

    // Add trigger event
    this.trigger('tick')
  }
  // Cancel animation frame
  stop() {
    window.cancelAnimationFrame(this.ticker)
  }
}