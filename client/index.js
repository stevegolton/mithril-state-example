// Babel has deprecated @babel/polyfill, and the following two imports are used for polyfills instead.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import m from 'mithril';
import { SerializableState } from './SerializableState';
import { RegularState } from './RegularState';

m.mount(document.body, RegularState);
