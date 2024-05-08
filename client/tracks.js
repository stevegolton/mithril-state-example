import m from "mithril";

export class DummyTrack {
  render() {
    return <span style="color: grey">DummyTrack</span>;
  }
}

export class SliceTrack {
  constructor(state) {
    this.state = state;
  }
  render() {
    return <span style="color: red">`SliceTrack: ${this.state.query}`</span>;
  }
}

export class CounterTrack {
  constructor(state) {
    this.state = state;
  }
  render() {
    return <span style="color: blue">`CounterTrack: ${this.state.query}`</span>;
  }
}
