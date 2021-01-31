import React, { useContext, useEffect } from 'react';
import MapContext from '../map/MapContext';
import { Map, Overlay } from 'ol';
// eslint-disable-next-line import/named
import Icon, { IconType } from '@icon-park/react/es/all';
import { ListItem } from 'src/types';
import { Popup } from 'semantic-ui-react';
interface Props {
  item: ListItem;
}
const MarkerOverlay = ({ item }: Props) => {
  const { map } = useContext(MapContext);
  
  useEffect(() => {
    if (!map) return;
    const overlay = new Overlay({
      element : document.getElementById('ol-popup') as HTMLElement
    });
    (map as Map).addOverlay(overlay);
    overlay.setPosition(item.coordinate);

    // (map as Map).on('singleclick', (e) => {
    //   const coordinate = e.coordinate;
    //   console.log(coordinate);
    //   const hdms = toStringHDMS(toLonLat(coordinate));
    //   overlay.setPosition(coordinate);
    // });

  }, [map]);
  return (
    <Popup content={item.title} size="tiny" position="right center" trigger={<Icon id="ol-popup" type={item.iconType as IconType} theme="filled" />} />
  );
};
export default MarkerOverlay;