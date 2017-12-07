const withStyle = getStyles => Component => {
  const styles = getStyles();

  const sytleWrapper = ({ style = {}, ...others }) => {
    const mergedStyles = {};
    Object.keys(styles).forEach(key=>{
      Object.assign(mergedStyles[key] = {},styles[key],style[key]);
    });

    return <Component style={mergedStyles} {...others } />
  }
  sytleWrapper.displayName = `sytleWrapper(${getDisplayName(Component)})`;

  return sytleWrapper;
}

export default withStyle


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}