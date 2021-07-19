import React from 'react';
import Container from '@material-ui/core/Container';

const CoteacherAccepted = ({ isDecline }) => {
	return <Container>CoteacherAccepted {isDecline && 'is decline'}</Container>;
};

export default CoteacherAccepted;
