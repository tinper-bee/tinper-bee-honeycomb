import FolderWidget from './folder';
import defaultWidget from './default';
import normalWidget from './normal';

function WidgetMaker({
  type,
  jsurl,
}) {
  switch (type) {
    case 2:
      return FolderWidget;
    default:
      if (jsurl) {
        return normalWidget;
      }
      return defaultWidget;
  }
}

export default WidgetMaker;
