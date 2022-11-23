import { useSelector, useDispatch } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';
import { setSelectedOrigins } from 'store/appSlice';

export const SELECTED_TRACT_ORIGINS_LAYER_ID = 'selectedTractOriginsLayer';

export default function SelectedTractOriginsLayer() {
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
      id: SELECTED_TRACT_ORIGINS_LAYER_ID,
      getFillColor: [0, 0, 0, 0],
      pointRadiusMinPixels: 2,
      getLineColor: [0, 0, 0],
      lineWidthMinPixels: 2,
      pickable: false,
      onDataLoad: (d) => {
        console.log(d);
      },
      onClick: (e) => {
        const clickedName = e.object.properties.name;
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
