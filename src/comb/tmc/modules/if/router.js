/*
* fm模块路由表
*
* */
import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import Register from './pages/if_register';
// import ApplyPurchase from './pages/if_applypurchase/index';
import Purchase from './pages/if_purchase/index';
import Detail from './pages/if_detail/index';
import Agreement from './pages/if_agreement/index';
import Myasset from './pages/if_myasset/index';
import RegisterT from './pages/if_register/registerT';
import RegisterS from './pages/if_register/registerS';
import Registerwarte from './pages/if_register/registerwarte';
import Management from './pages/if_management/index';
import Activation from './pages/if_register/activation';
import Activationscs from './pages/if_register/activationscs';
import Offline from './pages/if_offline'
import Ledger from './pages/if_ledger'
import AssetModal from './containers/AssetModal'
import Registerword from './pages/registerword/index'
const Routers = (
    <div>       
        <Route path="purchase" component={Purchase}/>
        <Route path="detail" component={Detail}/>
        <Route path='registerword' component={Registerword}/>
        <Route path="agreement" component={Agreement}/>
        <Route path="register" component={Register}/>
        <Route path="myasset" component={Myasset}/>
        <Route path="registert" component={RegisterT}/>
        <Route path="registers" component={RegisterS}/> 
        <Route path='registerwarte' component={Registerwarte}/>
        <Route path='management' component={Management}/>
        <Route path='activation' component={Activation}/>
        <Route path='activationscs' component={Activationscs}/>
        <Route path='offline' component={Offline}/>
        <Route path='ledger' component={Ledger}/>
        <Route path='assetmodal' component={AssetModal}/>
    </div>
);
export default Routers;
