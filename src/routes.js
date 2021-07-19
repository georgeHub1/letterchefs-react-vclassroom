import React from 'react';
import { Navigate } from 'react-router-dom';
import AccountView from './views/account/AccountView';
import DashboardLayout from './layouts/DashboardLayout';
import FormLayout from './layouts/FormLayout';
import MainLayout from './layouts/MainLayout';
import BookLayout from './layouts/BookLayout';

import ClassRooms from './views/teachers/OnboardingView';
import CreateReadingSession from './views/teachers/ReadingSessionsView/CreateReadingSession';
import InvitationActionScreen from './views/teachers/InvitationsView/ActionScreen';
import Invitations from './views/teachers/InvitationsView';
import OnboardAdmins from './views/admins/Onboardingview';
// import OnboardParents from './views/parents/OnboardingView';
import StudentsListView from './views/teachers/StudentsListView';
import CheckListView from './views/teachers/CheckListView';
import UpdatesView from './views/teachers/UpdatesView';

import ReadingSessionsView from './views/teachers/ReadingSessionsView';
import ReadingTicketsView from './views/teachers/ReadingSessionsView/TicketListings';
import ReadingTicketPage from './views/teachers/ReadingSessionsView/TicketPage';
import Stories from './views/teachers/ReadingSessionsView/Stories';
import StoryPage from './views/teachers/ReadingSessionsView/StoryPage';
import ParentsListView from './views/parents/ParentsListView';
import StorytimeView from './views/parents/StorytimeView';
import LoginView from './views/auth/LoginView';
import VerifyEmailView from './views/auth/VerifyEmailView';
import SetChildrenView from './views/auth/SetChildrenView';
import NotFoundView from './views/errors/NotFoundView';
import SettingsView from './views/settings/SettingsView';
import Classes from './views/class';
import NewClasses from './views/classes';
import NewClass from './views/classes/Class';
import ClassView from './views/class/ClassView';
// import StudentClassView from './views/class/ClassView/Student';
// import GuestTeacherClassView from './views/class/ClassView/GuestTeacher';
import PrepareToEnterClassView from './views/class/PrepareToEnterClass';

import { userID, userDetails } from './helpers';
import Books from './views/books/Book';
console.log(userDetails);
const user_type = userDetails.user_type;

let routes;
let forwardRoute = '/app'; // need to check role and change forwardRoute for teacher, parent, author

const login = {
	path: '/login',
	element: <FormLayout />,
	children: [
		{ path: '/', element: <LoginView /> },
		{ path: ':user_type', element: <LoginView /> },
	],
};
const register = {
	path: '/register',
	element: <FormLayout />,
	children: [
		{ path: '/', element: <LoginView isSignUp /> },
		{ path: '/:user_type', element: <LoginView isSignUp /> },
	],
};

const books = {
	path: '/books',
	element: <BookLayout />,
	children: [
		{
			path: '/the-legend-of-the-white-chrysanthemum',
			element: <Books />,
		},
		{
			path: '/vn/the-legend-of-the-white-chrysanthemum',
			element: <Books />,
		},
		{
			path: '/es/the-legend-of-the-white-chrysanthemum',
			element: <Books />,
		},
		{
			path: '/cn/the-legend-of-the-white-chrysanthemum',
			element: <Books />,
		},
	],
};

const joinClassTeachers = {
	path: '/class',
	element: <MainLayout />,
	children: [
		{
			path: ':class_id',
			children: [
				{
					path: '/',
					element: <PrepareToEnterClassView />,
				},
				{
					path: '/prepare',
					element: <PrepareToEnterClassView />,
				},
				{ path: '/in', element: <ClassView /> },
				{
					path: '/event/:event_id',
					children: [
						{ path: '/', element: <PrepareToEnterClassView /> },
						{ path: '/in', element: <ClassView /> },
					],
				},
			],
		},
	],
};

const listClassesTeachers = {
	path: '/classes',
	element: <DashboardLayout />,
	children: [
		{ path: '/', element: <NewClasses /> },
		{
			path: ':class_id',
			children: [
				{ path: '/', element: <NewClass /> },
				{
					path: '/event/:event_id',
					element: <MainLayout />,
					children: [
						{ path: '/', element: <PrepareToEnterClassView /> },
						{ path: '/in', element: <ClassView /> },
					],
				},
			],
		},
	],
};

const listInvitationsTeachers = {
	path: '/invitations',
	element: <DashboardLayout />,
	children: [
		{ path: '/', element: <Invitations /> },
		{ path: ':class_id', element: <InvitationActionScreen /> },
	],
};

const joinClassParents = {
	path: '/class',
	element: <MainLayout />,
	children: [
		{
			path: '/class',
			element: <MainLayout />,
			children: [
				{
					path: '/',
					element: <PrepareToEnterClassView />,
				},
				{
					path: '/prepare',
					element: <PrepareToEnterClassView />,
				},
				{ path: '/in', element: <ClassView /> },
			],
		},
	],
};

const tickets = {
	path: '/',
	element: <MainLayout />,
	children: [
		{
			path: 'tickets',
			children: [
				{ path: '/', element: <ReadingTicketsView /> },
				{ path: ':ticket_id', element: <ReadingTicketPage /> },
				{ path: ':ticket_id/mustpay', element: <ReadingTicketPage mustPay /> },
			],
		},
	],
};

const exploreStories = {
	path: '/',
	element: <MainLayout />,
	children: [
		{
			path: 'online-storytime',
			children: [
				{ path: '/', element: <Stories /> },
				{ path: ':story_id', element: <StoryPage /> },
			],
		},
	],
};

const verifyEmailRouting = { path: 'verify-email', element: <VerifyEmailView /> };

const appParents = {
	path: 'app',
	element: <DashboardLayout />,
	children: [
		{ path: '/', element: <StorytimeView /> },
		{ path: 'profile', element: <AccountView /> },
		{ path: 'parents', element: <ParentsListView /> },
		{ path: 'students', element: <StudentsListView /> },
		{ path: 'storytimes', element: <StorytimeView /> },
		{ path: 'updates', element: <UpdatesView /> },
		{ path: 'settings', element: <SettingsView /> },
		{ path: 'reading-sessions', element: <StorytimeView /> },
		verifyEmailRouting,
	],
};

const appTeachers = {
	path: 'app',
	element: <DashboardLayout />,
	children: [
		{ path: '/', element: <ReadingSessionsView /> },
		{ path: 'profile', element: <AccountView /> },
		{ path: 'parents', element: <ParentsListView /> },
		{ path: 'students', element: <StudentsListView /> },
		{ path: 'ideas', element: <CheckListView /> },
		{ path: 'reading-sessions', element: <ReadingSessionsView /> },
		{ path: 'updates', element: <UpdatesView /> },
		{ path: 'settings', element: <SettingsView /> },
		verifyEmailRouting,
	],
};

const notFound = { path: '404', element: <NotFoundView /> };
const notFoundForwarded = { path: '*', element: <Navigate to='/404' /> };

const mainSchoolAdmins = {
	path: '/',
	element: <MainLayout />,
	children: [
		{ path: '/', element: <Navigate to={`${forwardRoute}/profile`} /> },
		{
			path: 'onboarding',
			children: [
				{ path: '/', element: <ClassRooms /> },
				{ path: '/administrators', element: <OnboardAdmins /> },
			],
		},
		notFound,
	],
};

const mainTeachers = {
	path: '/',
	element: <MainLayout />,
	children: [
		{ path: '/', element: <Navigate to={`${forwardRoute}/reading-sessions`} /> },
		{
			path: 'onboarding',
			children: [{ path: '/', element: <ClassRooms /> }],
		},
		{
			path: 'create-reading-session',
			children: [{ path: '/', element: <CreateReadingSession /> }],
		},
		notFound,
	],
};

const mainParents = {
	path: '/',
	element: <MainLayout />,
	children: [
		{ path: '/', element: <Navigate to={`${forwardRoute}/storytimes`} /> },
		{
			path: 'onboarding',
			children: [
				{
					path: '/parents',
					element: <FormLayout />,
					children: [{ path: '/', element: <SetChildrenView /> }],
				},
			],
		},
		notFound,
	],
};

const routesParents = [appParents, books, joinClassParents, mainParents, notFound];

const routesTeachers = [
	appTeachers,
	books,
	tickets,
	exploreStories,
	joinClassTeachers,
	listClassesTeachers,
	listInvitationsTeachers,
	mainTeachers,
	{
		path: '/class',
		element: <DashboardLayout />,
		children: [{ path: '/', element: <Classes /> }],
	},
	notFoundForwarded,
];

const routesAuthors = [...routesTeachers];
const routesSchoolAdmins = [
	appTeachers,
	books,
	tickets,
	exploreStories,
	joinClassTeachers,
	mainSchoolAdmins,
	notFoundForwarded,
];

if (!userID)
	routes = [
		{
			path: '/',
			element: <FormLayout />,
			children: [
				{ path: '/', element: <LoginView /> },
				{ path: '*', element: <LoginView /> },
			],
		},
		books,
		tickets,
		login,
		register,
	];
else {
	if (user_type === 'teacher') {
		routes = routesTeachers;
		forwardRoute += '/reading-sessions';
	} else if (user_type === 'author') {
		routes = routesAuthors;
		forwardRoute += '/profile';
	} else if (user_type === 'school_admin') {
		forwardRoute += '/profile';
		routes = routesSchoolAdmins;
	} else {
		//parents
		forwardRoute += '/storytimes';
		routes = routesParents;
	}

	routes = [{ path: '/', element: <Navigate to={forwardRoute} /> }, ...routes];
}

export default routes;
