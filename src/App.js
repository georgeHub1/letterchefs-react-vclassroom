import React from 'react';
import { useRoutes } from 'react-router-dom';
import 'react-perfect-scrollbar/dist/css/styles.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CloudinaryContext } from 'cloudinary-react';

import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';

import { stripePubKey } from './config';

const stripePromise = loadStripe(stripePubKey);

const App = () => {
	const routing = useRoutes(routes);

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />
			<CssBaseline />
			<CloudinaryContext cloudName='lienista'>
				<Elements stripe={stripePromise}>{routing}</Elements>
			</CloudinaryContext>
		</ThemeProvider>
	);
};

export default App;
