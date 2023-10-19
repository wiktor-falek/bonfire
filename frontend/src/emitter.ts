import mitt from "mitt";

type Events = {
  openSidePanel: undefined;
};

const emitter = mitt<Events>();

export default emitter;
