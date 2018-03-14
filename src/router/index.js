import Loadable from 'react-loadable'

const MyLoadingComponent = function ({ error, pastDelay }) {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

const routes = [
  {
    path: "/",
    exact: true,
    component:Loadable({
      loader: () => import('containers/home/index'),
      loading: MyLoadingComponent
    })
  },
  {
    path: "/user",
    component:Loadable({
      loader: () => import('containers/user/index'),
      loading: MyLoadingComponent
    })
  },
  {
    path: "/list",
    component:Loadable({
      loader: () => import('containers/list/index'),
      loading: MyLoadingComponent
    })
  }
];

export default routes