import mitt from "mitt";

type Events = {
  openSidePanel: undefined;
  closeSidePanel: undefined;
};

const emitter = mitt<Events>();

export default emitter;
