import React, { /* Fragment, */ forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// import { NavLink } from 'react-router-dom';
// import { Alert } from '@material-ui/lab';
// import { Typography /* , makeStyles */ } from '@material-ui/core';

import VerifyEmailDialog from '../views/auth/VerifyEmailDialog';
import PageContext from '../contexts/Page';
import { userDetails } from '../helpers';

const Page = forwardRef(({ children, title = 'Onboarding', ...rest }, ref) => {
	const [showEmailVerify, setShowEmailVerify] = useState(true);

	return (
		<div ref={ref} {...rest}>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			{!userDetails.email_verified && showEmailVerify && <VerifyEmailDialog />}
			{/* !userDetails.email_verified && (
				<Fragment>
					<Alert severity='info'>
						You need to <NavLink to='/app/verify-email'>verify your email</NavLink>
					</Alert>
					<Typography variant='body1'>
						Email Verification Pending A verification email has been sent to your registered email
						address. To start using your Letterchefs account, please complete the verification by
						following the instructions given in the email. Check your spam folder to make sure it
						didn&rsquo;t end up there. If you do not receive the verification email within 2 minutes
						of completing the registration, you can resend the verification email by clicking here.
					</Typography>
				</Fragment>
			) */}
			<PageContext.Provider value={{ showEmailVerify, setShowEmailVerify }}>
				{children}
			</PageContext.Provider>
		</div>
	);
});

Page.displayName = 'Page';
Page.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
};

export default Page;
