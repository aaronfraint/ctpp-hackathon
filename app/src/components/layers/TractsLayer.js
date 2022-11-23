import { useSelector, useDispatch } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';

import htmlForFeature from 'utils/htmlForFeature';
import { setSelectedOrigins, setSelectedDestinations } from 'store/appSlice';

export const TRACTS_LAYER_ID = 'tractsLayer';

const handleData = (dataList, clickedName) => {
  let data;
  if (dataList.length === 0) {
    data = [clickedName];
  } else {
    data = [...dataList];
    if (!dataList.includes(clickedName)) {
      data.push(clickedName);
    } else {
      data.pop(clickedName);
    }
  }
  return data;
};

export default function TractsLayer() {
  const { tractsLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, tractsLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });

  const dispatch = useDispatch();
  const selectedOrigins = useSelector((state) => state.app.selectedOrigins);
  const selectedDestinations = useSelector((state) => state.app.selectedDestinations);
  const activeMode = useSelector((state) => state.app.activeMode);

  if (tractsLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: TRACTS_LAYER_ID,
      getFillColor: [241, 109, 122],
      pointRadiusMinPixels: 2,
      getLineColor: [255, 0, 0],
      lineWidthMinPixels: 1,
      pickable: true,
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({ feature: info.object }),
            style: {},
          };
        }
      },
      onClick: (e) => {
        const clickedName = e.object.properties.name;

        if (activeMode === 'origins') {
          let data = handleData(selectedOrigins, clickedName);
          dispatch(setSelectedOrigins(data));
        } else if (activeMode === 'destinations') {
          let data = handleData(selectedDestinations, clickedName);
          dispatch(setSelectedDestinations(data));
        }
      },
    });
  }
}
