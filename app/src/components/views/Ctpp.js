import { useEffect } from 'react';
import flowsSource from 'data/sources/flowsSource';
import { FLOWS_LAYER_ID } from 'components/layers/FlowsLayer';
import destinationsSource from 'data/sources/destinationsSource';
import { DESTINATIONS_LAYER_ID } from 'components/layers/DestinationsLayer';
import { useDispatch, useSelector } from 'react-redux';
import originsSource from 'data/sources/originsSource';
import { ORIGINS_LAYER_ID } from 'components/layers/OriginsLayer';
import tractsSource from 'data/sources/tractsSource';
import { TRACTS_LAYER_ID } from 'components/layers/TractsLayer';
import censusTractsSource from 'data/sources/censusTractsSource';
import { TRACT_ORIGINS_LAYER_ID } from 'components/layers/TractOriginsLayer';
import { SELECTED_TRACT_ORIGINS_LAYER_ID } from 'components/layers/SelectedTractOriginsLayer';
import {
  addLayer,
  removeLayer,
  addSource,
  removeSource,
  addFilter,
} from '@carto/react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import {
  setActiveMode,
  setSelectedDestinations,
  setSelectedOrigins,
} from 'store/appSlice';

const useStyles = makeStyles(() => ({
  ctpp: { padding: '1rem' },
  btn: { marginTop: '1rem', width: '100%' },
}));

function UIButton({ text, code }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const activeMode = useSelector((state) => state.app.activeMode);

  return (
    <Button
      variant={activeMode === code ? 'contained' : 'outlined'}
      color={activeMode === code ? 'secondary' : 'primary'}
      className={classes.btn}
      onClick={() => {
        dispatch(setActiveMode(code));

        if (code === 'start') {
          dispatch(setSelectedOrigins([]));
          dispatch(setSelectedDestinations([]));
        }
      }}
    >
      {text}
    </Button>
  );
}

export default function Ctpp() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const selectedOrigins = useSelector((state) => state.app.selectedOrigins);
  const selectedDestinations = useSelector((state) => state.app.selectedDestinations);
  const activeMode = useSelector((state) => state.app.activeMode);

  function UIButtonClick(text) {
    dispatch(setActiveMode(text));
  }

  useEffect(() => {
    dispatch(addSource(censusTractsSource));

    dispatch(
      addLayer({
        id: TRACT_ORIGINS_LAYER_ID,
        source: censusTractsSource.id,
      })
    );

    return () => {
      dispatch(removeLayer(TRACT_ORIGINS_LAYER_ID));
      dispatch(removeSource(censusTractsSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(addSource(tractsSource));

    dispatch(
      addLayer({
        id: TRACTS_LAYER_ID,
        source: tractsSource.id,
      })
    );

    return () => {
      dispatch(removeLayer(TRACTS_LAYER_ID));
      dispatch(removeSource(tractsSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(addSource(originsSource));

    dispatch(
      addLayer({
        id: ORIGINS_LAYER_ID,
        source: originsSource.id,
      })
    );

    const action = addFilter({
      id: originsSource.id,
      column: 'name',
      type: 'in',
      values: selectedOrigins,
    });

    dispatch(action);

    return () => {
      dispatch(removeLayer(ORIGINS_LAYER_ID));
      dispatch(removeSource(originsSource.id));
    };
  }, [dispatch, selectedOrigins]);

  useEffect(() => {
    dispatch(addSource(destinationsSource));

    dispatch(
      addLayer({
        id: DESTINATIONS_LAYER_ID,
        source: destinationsSource.id,
      })
    );

    const action = addFilter({
      id: destinationsSource.id,
      column: 'name',
      type: 'in',
      values: selectedDestinations,
    });

    dispatch(action);

    return () => {
      dispatch(removeLayer(DESTINATIONS_LAYER_ID));
      dispatch(removeSource(destinationsSource.id));
    };
  }, [dispatch, selectedDestinations]);

  useEffect(() => {
    dispatch(addSource(flowsSource));

    if (activeMode === 'flows') {
      console.log('flows');
      dispatch(
        addLayer({
          id: FLOWS_LAYER_ID,
          source: flowsSource.id,
        })
      );
      dispatch(
        addFilter({
          id: flowsSource.id,
          column: 'ORIGIN_NAM',
          type: 'in',
          values: selectedOrigins,
        })
      );
    }

    return () => {
      dispatch(removeLayer(FLOWS_LAYER_ID));
      dispatch(removeSource(flowsSource.id));
    };
  }, [dispatch, selectedOrigins, selectedDestinations, activeMode]);

  // [hygen] Add useEffect

  return (
    <Grid container direction='column' className={classes.ctpp}>
      <Grid item>
        <Typography variant='h4'>CTPP Flows</Typography>

        <ol>
          <li>Select origin and/or destination census tracts</li>
          <li>Show the flows</li>
        </ol>

        <UIButton text={'Select Origins'} code={'origins'} />
        <UIButton text={'Select Destinations'} code={'destinations'} />
        <UIButton text={'Show FLOWS'} code={'flows'} />
        {activeMode !== 'start' && <UIButton text={'Start Over'} code={'start'} />}
      </Grid>
    </Grid>
  );
}
