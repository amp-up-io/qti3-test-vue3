export class TestTimer {

  testTimer
  testDuration

  constructor () {
    this.setTime(0)
  }

  getTime () {
    return this.testDuration
  }

  setTime (time) {
    this.testDuration = time
  }

  startTimer () {
    this.clearTimer()
    this.setTime(0)
    this.testTimer = setInterval(this.updateTime.bind(this), 1000)
  }

  updateTime () {
    ++this.testDuration
  }

  resetTimer () {
    this.clearTimer()
    this.setTime(0)
  }

  clearTimer () {
    clearInterval(this.testTimer)
  }

}