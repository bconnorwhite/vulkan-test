import { init, render } from "./engine";

const engine = init({
  view: {
    title: "Triangle",
    width: 480,
    height: 320
  }
});

render(engine);

