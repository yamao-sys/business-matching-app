import App from '@/App';
import { NotFound } from '@/components/organisms/NotFound';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
]);
