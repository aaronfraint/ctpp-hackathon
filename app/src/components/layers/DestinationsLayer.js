import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const DESTINATIONS_LAYER_ID = 'destinationsLayer';

export default function DestinationsLayer() {
  const { destinationsLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) =>
    selectSourceById(state, destinationsLayer?.source)
  );
  const cartoLayerProps = useCartoLayerProps({ source });

  if (destinationsLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: DESTINATIONS_LAYER_ID,
      getFillColor: [0, 0, 255],
      pointRadiusMinPixels: 2,
      getLineColor: [255, 0, 0],
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
