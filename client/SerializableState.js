import m from "mithril";
import { produce } from "immer";
import { DummyTrack, SliceTrack, CounterTrack } from "./tracks";

const trackResolvers = new Map();
trackResolvers.set("dummy", () => new DummyTrack());
trackResolvers.set("slice", (x) => new SliceTrack(x));
trackResolvers.set("counter", (x) => new CounterTrack(x));

function createRandomTrack() {
  const resolvers = ["dummy", "slice", "counter"];
  const queries = [
    "select * from slice",
    "select * from counter where ts > 123",
    "select * from ftrace_raw limit 10",
  ];

  return {
    resolver: resolvers[Math.floor(Math.random() * resolvers.length)],
    state: {
      query: queries[Math.floor(Math.random() * queries.length)],
    },
  };
}

const defaultState = {
  trackList: [
    {
      resolver: "dummy",
      state: {},
    },
    {
      resolver: "slice",
      state: {
        query: "select * from slice",
      },
    },
    {
      resolver: "counter",
      state: {
        query: "select * from raw",
      },
    },
  ],
};

export function SerializableState() {
  window.state = produce(defaultState, (a) => a);

  function view() {
    return (
      <div>
        <h1>Serializable State Example</h1>
        <h2>Tracklist</h2>
        <div>
          <button
            onclick={() =>
              (state = produce(state, (d) => {
                d.trackList.push(createRandomTrack());
                d.previousState = state;
              }))
            }
          >
            Add random track
          </button>
          <button
            onclick={() =>
              (state = produce(state, (d) => {
                d.trackList.pop();
                d.previousState = state;
              }))
            }
          >
            Remove last track
          </button>
          <button onclick={() => m.redraw()}>Redraw</button>
          <button
            onclick={() => (state = produce(state, (d) => d.previousState))}
          >
            Undo
          </button>
          <button
            onclick={() => localStorage.setItem("state", JSON.stringify(state))}
          >
            Save State
          </button>
          <button
            onclick={() => (state = JSON.parse(localStorage.getItem("state")))}
          >
            Restore State
          </button>
          <button
            onclick={() => (window.state = produce(defaultState, (a) => a))}
          >
            Reset
          </button>
        </div>
        <ul>
          {state.trackList.map((t) => {
            const state = t.state;
            const trackObject = trackResolvers.get(t.resolver)(state);
            return <li>{trackObject.render()}</li>;
          })}
        </ul>
      </div>
    );
  }

  return { view };
}
