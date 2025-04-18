// modules css
import './index.css';
import 'dayjs/locale/zh-tw'; // 載入繁體中文語系

import {GridThemeProvider} from '@acrool/react-grid';
import composedProviders, {providerWithProps} from '@acrool/react-providers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {createElement} from 'react';
import ReactDOM from 'react-dom/client';

import App from './views/App';




// 設定 dayjs().tz() 的時區
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('zh-tw');

// dayjs.tz.setDefault(countriesConfig[siteConfigs.country].timezone);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    createElement(composedProviders(
        [
            providerWithProps(GridThemeProvider, {}),
        ]
    )(App))
);

