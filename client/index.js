// Babel has deprecated @babel/polyfill, and the following two imports are used for polyfills instead.
import "core-js/stable";
import "regenerator-runtime/runtime";
import m from "mithril";
import { SerializableState } from "./SerializableState";
import { RegularState } from "./RegularState";

m.route(document.body, "/home", {
  "/home": Home,
  "/serializable": SerializableState, // defines `https://localhost/#!/serializable`
  "/regular": RegularState, // defines `https://localhost/#!/regular`
});

function Home() {
  const view = function () {
    return (
      <nav>
        <ul>
          <li>
            <a href="#!/serializable">Serializable</a>
          </li>
          <li>
            <a href="#!/regular">Regular</a>
          </li>
        </ul>
      </nav>
    );
  };

  return { view };
}
