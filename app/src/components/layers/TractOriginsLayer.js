import { useSelector, useDispatch } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';
import { setSelectedOrigins } from 'store/appSlice';

export const TRACT_ORIGINS_LAYER_ID = 'tractOriginsLayer';

export default function TractOriginsLayer() {
  const { tractOriginsLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) =>
    selectSourceById(state, tractOriginsLayer?.source)
  );
  const cartoLayerProps = useCartoLayerProps({ source });

  const dispatch = useDispatch();
  const selectedOrigins = useSelector((state) => state.app.selectedOrigins);

  if (tractOriginsLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: TRACT_ORIGINS_LAYER_ID,
      getFillColor: [0, 0, 255],
      pointRadiusMinPixels: 2,
      getLineColor: [0, 0, 0],
      lineWidthMinPixels: 0.5,
      autoHighlight: true,
      pickable: true,
      // highlightColor: (d) => [0, 255, 255],
      onClick: (e) => {
        const clickedName = e.object.properties.name;
        let data;
        if (selectedOrigins.length === 0) {
          data = [clickedName];
        } else {
          data = [...selectedOrigins];
          if (!selectedOrigins.includes(clickedName)) {
            data.push(clickedName);
          } else {
            data.pop(clickedName);
          }
        }

        dispatch(setSelectedOrigins(data));
      },
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
