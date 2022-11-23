import { MAP_TYPES } from '@deck.gl/carto';

const FLOWS_SOURCE_ID = 'flowsSource';

const source = {
  id: FLOWS_SOURCE_ID,
  type: MAP_TYPES.TILESET,
  connection: 'se-bigquery',
  data: `cartodb-gcp-solutions-eng-team.CTPP.tract_to_tract_curves_geom_tileset`,
};

export default source;
