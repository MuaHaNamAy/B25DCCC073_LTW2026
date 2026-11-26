import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { NoticeProvider } from './context/NoticeContext';

// [BÀI 2 - mục 3, 4] Provider (Redux) > ThemeProvider > NoticeProvider
// [BÀI 3 - mục 5] Đã bỏ <React.StrictMode> để bộ đếm "Số lần render" không bị nhân đôi
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <NoticeProvider>
        <App />
      </NoticeProvider>
    </ThemeProvider>
  </Provider>
);
