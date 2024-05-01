export class DummyTrack {
  render() {
    return `DummyTrack`;
  }
}

export class SliceTrack {
  constructor(state) {
    this.state = state;
  }
  render() {
    return `SliceTrack: ${this.state.query}`;
  }
}

export class CounterTrack {
  constructor(state) {
    this.state = state;
  }
  render() {
    return `CounterTrack: ${this.state.query}`;
  }
}
