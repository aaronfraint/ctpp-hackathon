import TractsLayer from './TractsLayer';
import OriginsLayer from './OriginsLayer';
import DestinationsLayer from './DestinationsLayer';
import FlowsLayer from './FlowsLayer';
// [hygen] Import layers

export const getLayers = () => {
  return [
    TractsLayer(),
    OriginsLayer(),

    DestinationsLayer(),
    FlowsLayer(),
    // [hygen] Add layer
  ];
};
