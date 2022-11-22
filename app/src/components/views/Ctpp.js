import { useEffect } from 'react';
import censusTractsSource from 'data/sources/censusTractsSource';
import { TRACT_ORIGINS_LAYER_ID } from 'components/layers/TractOriginsLayer';
import { useDispatch } from 'react-redux';
import {
  addLayer,
  removeLayer,
  addSource,
  removeSource,
} from '@carto/react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  ctpp: {},
}));

export default function Ctpp() {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(addSource(censusTractsSource));

    dispatch(
      addLayer({
        id: TRACT_ORIGINS_LAYER_ID,
        source: censusTractsSource.id,
      }),
    );

    return () => {
      dispatch(removeLayer(TRACT_ORIGINS_LAYER_ID));
      dispatch(removeSource(censusTractsSource.id));
    };
  }, [dispatch]);

  // [hygen] Add useEffect

  return (
    <Grid container direction='column' className={classes.ctpp}>
      <Grid item>Hello World</Grid>
    </Grid>
  );
}
