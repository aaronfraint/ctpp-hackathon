import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const ORIGINS_LAYER_ID = 'originsLayer';

export default function OriginsLayer() {
  const { originsLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, originsLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });

  if (originsLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: ORIGINS_LAYER_ID,
      getFillColor: [0, 255, 0],
      pointRadiusMinPixels: 2,
      getLineColor: [0, 0, 0],
      lineWidthMinPixels: 1,
      pickable: false,
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
