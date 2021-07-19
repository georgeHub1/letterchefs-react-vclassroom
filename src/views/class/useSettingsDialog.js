import { useState, useCallback } from 'react';

const useSettingsDialog = () => {
	const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
	const toggleSettingsDialogOpen = useCallback(() => setSettingsDialogOpen((x) => !x), []);

	return [settingsDialogOpen, toggleSettingsDialogOpen];
};

export default useSettingsDialog;
