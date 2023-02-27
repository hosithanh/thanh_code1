import { ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import viVN from 'antd/lib/locale/vi_VN'
import 'font-awesome/css/font-awesome.min.css'
import { createBrowserHistory } from 'history'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { store } from "store"
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'
ReactDOM.render(
    <Provider store={store}>
        <Router history={createBrowserHistory()}>
            <ConfigProvider locale={viVN}>
                <App />
            </ConfigProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
