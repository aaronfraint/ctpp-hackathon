import { MAP_TYPES } from '@deck.gl/carto';

const TRACTS_SOURCE_ID = 'tractsSource';

const source = {
  id: TRACTS_SOURCE_ID,
  type: MAP_TYPES.TILESET,
  connection: 'se-bigquery',
  data: `cartodb-gcp-solutions-eng-team.CTPP.merged_tracts_geom_tileset`,
};

export default source;
