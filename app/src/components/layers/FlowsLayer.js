import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const FLOWS_LAYER_ID = 'flowsLayer';

export default function FlowsLayer() {
  const { flowsLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, flowsLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });

  if (flowsLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: FLOWS_LAYER_ID,
      getFillColor: [241, 109, 122],
      pointRadiusMinPixels: 2,
      getLineColor: [0, 0, 255],
      lineWidthMinPixels: 3,
      pickable: true,
      onClick: (e) => {
        console.log(e.object.properties);
      },
      getLineWidth: (d) => d.B302203_E1 / 10,
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({ feature: info.object }),
            style: {},
          };
        }
      },
    });
  }
}
