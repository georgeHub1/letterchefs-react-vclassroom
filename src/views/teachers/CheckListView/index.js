import React from 'react';
import {
	Box,
	Checkbox,
	Container,
	Grid,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';
import Page from '../../../components/Page';
import Color from '../../../mixins/palette';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	itemTitle: {
		color: Color.hex.liberty,
	},
}));

const CheckListView = () => {
	const classes = useStyles();

	return (
		<Page className={classes.root} title='Ideas to Prep Class'>
			<Container maxWidth={false}>
				<Box mt={3} mb={3}>
					<Typography variant='h3'>Ideas For Prepping Your Class</Typography>
				</Box>
				<Grid container>
					<Grid item xs={12}>
						<Paper>
							<Box p={3}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell padding='checkbox'>
												{/* <Checkbox
                        checked={selectedCustomerIds.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomerIds.length > 0
                          && selectedCustomerIds.length < customers.length
                        }
                        onChange={handleSelectAll}
                      /> */}
											</TableCell>
											<TableCell>
												<Typography color='textPrimary' variant='h4' className={classes.itemTitle}>
													Create Your Reading Event
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='flex'>
													<Typography color='textPrimary' variant='body1'>
														Create your reading class, by filling out the information about the
														class.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>

										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='flex'>
													<Typography color='textPrimary' variant='body1'>
														Invite a guest as a collaborator of your class. A guest invited as a
														collaborator has the same access as you and can see your students&rsquo;
														info.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='flex'>
													<Typography color='textPrimary' variant='body1'>
														Select a book for your reading session.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell padding='checkbox'>
												{/* <Checkbox
                        checked={selectedCustomerIds.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomerIds.length > 0
                          && selectedCustomerIds.length < customers.length
                        }
                        onChange={handleSelectAll}
                      /> */}
											</TableCell>
											<TableCell>
												<Typography color='textPrimary' variant='h4' className={classes.itemTitle}>
													Before A Reading Event
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='flex'>
													<Typography color='textPrimary' variant='body1'>
														We will send out email reminders to your students 30mins before your
														class, so you don&rsquo;t have to.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='flex'>
													<Typography color='textPrimary' variant='body1'>
														Prepare for your class, any way you would like to teach and spark those
														brilliant minds.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell padding='checkbox'>
												{/* <Checkbox
                        checked={selectedCustomerIds.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomerIds.length > 0
                          && selectedCustomerIds.length < customers.length
                        }
                        onChange={handleSelectAll}
                      /> */}
											</TableCell>
											<TableCell>
												<Typography color='textPrimary' variant='h4' className={classes.itemTitle}>
													During A Reading Session
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='block'>
													<Typography paragraph variant='body1'>
														Teachers can share the link manually to those who haven\&lsquo;t created
														an account. Anyone who has access to this link can join the reading
														session.
													</Typography>
													<Typography paragraph variant='body1'>
														Parents who have signed up should have a URL shared with them through
														email during each reading session. LetterChefs sends out email reminders
														to parents at these times: when a reading session is created, when a
														book is selected for that reading session and 1/2 hour before a reading
														session starts.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell padding='checkbox'>
												{/* <Checkbox
                        checked={selectedCustomerIds.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomerIds.length > 0
                          && selectedCustomerIds.length < customers.length
                        }
                        onChange={handleSelectAll}
                      /> */}
											</TableCell>
											<TableCell>
												<Typography color='textPrimary' variant='h4' className={classes.itemTitle}>
													After A Reading Session
												</Typography>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell padding='checkbox'>
												<Checkbox
													// checked={selectedCustomerIds.indexOf(customer.id) !== -1}
													// onChange={(event) => handleSelectOne(event, customer.id)}
													value='true'
												/>
											</TableCell>
											<TableCell>
												<Box display='flex'>
													<Typography variant='body1'>
														Thanks students for attending your class, and offer words of
														encouragement.
													</Typography>
												</Box>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

export default CheckListView;
