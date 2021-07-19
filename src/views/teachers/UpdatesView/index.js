import React /*, { useState } */ from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import Page from '../../../components/Page';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}));

const CheckListView = () => {
	const classes = useStyles();
	// const [customers] = useState(data);

	return (
		<Page className={classes.root} title='Updates | LetterChefs | Live Reading Classes'>
			<Container maxWidth={false}>
				<Box mt={3} mb={2}>
					<Typography gutterBottom variant='h3'>
						Updates
					</Typography>
				</Box>
			</Container>
		</Page>
	);
};

export default CheckListView;
