import m from "mithril";
import { produce } from "immer";
import { DummyTrack, SliceTrack, CounterTrack } from "./tracks";

function createRandomTrack() {
  const queries = [
    "select * from slice",
    "select * from counter where ts > 123",
    "select * from ftrace_raw limit 10",
  ];
  const trackFactories = [
    () => new DummyTrack(),
    () =>
      new SliceTrack({
        query: queries[Math.floor(Math.random() * queries.length)],
      }),
    () =>
      new CounterTrack({
        query: queries[Math.floor(Math.random() * queries.length)],
      }),
  ];

  return trackFactories[Math.floor(Math.random() * trackFactories.length)]();
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

function restoreState() {
  window.state = JSON.parse(localStorage.getItem("bar"));
}

function addRandomTrack() {
  const track = createRandomTrack();
  const id = uuidv4();
  tracks.set(id, track);
  state = produce(state, (d) => {
    d.trackList.push(id);
    d.previousState = state;
  });
}

function removeTrack() {
  const id = state.trackList[state.trackList.length - 1];
  state = produce(state, (d) => {
    d.trackList.pop();
    d.previousState = state;
  });
  tracks.delete(id);
}

const tracks = new Map();
tracks.set("1", new DummyTrack());
tracks.set("2", new SliceTrack({ query: "select * from slice" }));
tracks.set("3", new CounterTrack({ query: "select * from counter" }));

const initialTracks = ["1", "2", "3"];

const defaultState = {
  trackList: ["1", "2", "3"],
};

export function RegularState() {
  window.state = produce(defaultState, (a) => a);

  function view() {
    return (
      <div>
        <h1>Regular State Example</h1>
        <h2>Tracklist</h2>
        <div>{`Tracks in map ${tracks.size}`}</div>
        <div>{`Tracks in tracklist ${window.state.trackList.length}`}</div>
        <div>
          <button onclick={() => addRandomTrack()}>Add random track</button>
          <button onclick={() => removeTrack()}>Remove track</button>
          <button
            onclick={() => (state = produce(state, (d) => d.previousState))}
          >
            Undo
          </button>
          <button
            onclick={() => localStorage.setItem("bar", JSON.stringify(state))}
          >
            Save State
          </button>
          <button onclick={() => restoreState()}>Restore State</button>
          <button
            onclick={() => {
              window.state = { trackList: [...initialTracks] };
            }}
          >
            Reset
          </button>
        </div>
        <ul>
          {state.trackList.map((trackId) => {
            const track = tracks.get(trackId);
            if (track) {
              return <li>{track.render()}</li>;
            }
            return <li>!Missing Track!</li>;
          })}
        </ul>
      </div>
    );
  }

  return { view };
}
