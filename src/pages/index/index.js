import React from "react";
import ReactDOM from "react-dom";

import styles from './index.modules.less';
import logo from './images/3179314346-5f61e47221e07.png';

function Index() {
  return(<div className={styles.index}>
    <img src={logo} />
  </div>)
}

ReactDOM.render(<Index />, document.getElementById("root"));
