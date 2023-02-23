import './main.scss';

// esri config and auth
import esriConfig from '@arcgis/core/config';

// map and view
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

// application
import MapApplication from '@vernonia/map-application/dist/MapApplication';

// widgets
import Measure from '@vernonia/core/dist/widgets/Measure';
import PrintSnapshot from '@vernonia/core/dist/widgets/PrintSnapshot';

import NewWidget from './widgets/NewWidget';

// config portal and auth
esriConfig.portalUrl = 'https://gis.vernonia-or.gov/portal';

const load = async () => {
  // layers and friends
  const { extents, hillshadeBasemap, hybridBasemap, cityLimits, taxLots, searchViewModel } = await import('./layers');
  const { extent, constraintGeometry } = await extents();

  // view
  const view = new MapView({
    map: new Map({
      basemap: hillshadeBasemap,
      layers: [taxLots, cityLimits],
      ground: 'world-elevation',
    }),
    extent,
    constraints: {
      geometry: constraintGeometry,
      minScale: 40000,
      rotationEnabled: false,
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: 'bottom-left',
        breakpoint: false,
      },
    },
  });

  // application
  new MapApplication({
    contentBehind: true,
    title: 'Vite Map App',
    nextBasemap: hybridBasemap,
    panelPosition: 'end',
    panelWidgets: [
      {
        widget: new NewWidget({ view, layer: cityLimits }),
        text: 'New',
        icon: 'plus',
        type: 'calcite-panel',
        open: true,
      },
      {
        widget: new Measure({ view }),
        text: 'Measure',
        icon: 'measure',
        type: 'calcite-panel',
      },
      {
        widget: new PrintSnapshot({ view, printServiceUrl: '' }),
        text: 'Print',
        icon: 'print',
        type: 'calcite-panel',
      },
    ],
    searchViewModel,
    view,
  });

  // view.when(() => { });
};

load();
