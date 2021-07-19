import { useState, useCallback } from 'react';

const useDialog = (opened = false) => {
	const [showingDialog, setShowingDialog] = useState(opened);
	const openDialog = useCallback(() => setShowingDialog(true), []);
	const closeDialog = useCallback(() => setShowingDialog(false), []);

	return [showingDialog, openDialog, closeDialog];
};

export default useDialog;
