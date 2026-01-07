import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Avatar,
    Chip,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import {
    Edit,
    Camera,
    Visibility,
    VisibilityOff,
    Check,
    Close,
    Mail,
    Phone,
    CalendarToday,
    LocationOn,
    Business,
    Language,
    Notifications,
    Security,
    Palette,
    HelpOutline,
} from '@mui/icons-material';
import type { AlertColor } from '@mui/material/Alert';


export default function UserProfileSettings() {

    type SnackbarState = {
        open: boolean;
        message: string;
        severity: AlertColor;
    };

    // Dummy user data - would come from API
    const [userData, setUserData] = useState({
        name: 'John Anderson',
        email: 'john.anderson@company.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        company: 'Tech Solutions Inc.',
        role: 'Senior Developer',
        joinDate: 'January 2023',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: 'Passionate developer with 8+ years of experience in full-stack development.',
    });

    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        twoFactorAuth: true,
        darkMode: false,
        language: 'English',
    });

    const [editMode, setEditMode] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'info' | 'warning' | 'error',
    });
    const [formData, setFormData] = useState({ ...userData });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // Simulated API calls
    const fetchUserData = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSaveProfile = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setUserData({ ...formData });
            setEditMode(false);
            setLoading(false);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        }, 1000);
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setSnackbar({ open: true, message: 'Password must be at least 8 characters!', severity: 'error' });
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setPasswordDialog(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setLoading(false);
            setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
        }, 1000);
    };

    const handleSettingChange = (setting) => {
        setSettings({ ...settings, [setting]: !settings[setting] });
        setSnackbar({ open: true, message: 'Setting updated!', severity: 'success' });
    };

    const handleAvatarUpload = () => {
        // Simulate file upload
        setSnackbar({ open: true, message: 'Avatar upload functionality would trigger here', severity: 'info' });
    };

    if (loading && !editMode && !passwordDialog) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h1>
                    <p className="text-gray-600">Manage your profile and account preferences</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 "></div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-10">
                            <div className="flex items-end gap-4">
                                <div className="relative">
                                    <Avatar
                                        src={userData.avatar}
                                        sx={{ width: 80, height: 80, border: '4px solid white', boxShadow: 2 }}
                                    />
                                    <IconButton
                                        onClick={handleAvatarUpload}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                            width: 36,
                                            height: 36,
                                        }}
                                    >
                                        <Camera fontSize="small" />
                                    </IconButton>
                                </div>
                                <div className="mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                                    <p className="text-gray-600">{userData.role}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Chip label="Verified" size="small" color="primary" icon={<Check />} />
                                        <Chip label="Premium" size="small" variant="outlined" color="primary" />
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant={editMode ? "outlined" : "contained"}
                                startIcon={editMode ? <Close /> : <Edit />}
                                onClick={() => {
                                    if (editMode) {
                                        setFormData({ ...userData });
                                    }
                                    setEditMode(!editMode);
                                }}
                                sx={{ mt: { xs: 2, md: 0 } }}
                            >
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <TextField
                                label="Full Name"
                                value={editMode ? formData.name : userData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail className="text-gray-400" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Email Address"
                                value={editMode ? formData.email : userData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                                type="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail className="text-gray-400" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Phone Number"
                                value={editMode ? formData.phone : userData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone className="text-gray-400" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Location"
                                value={editMode ? formData.location : userData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn className="text-gray-400" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Company"
                                value={editMode ? formData.company : userData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business className="text-gray-400" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Role"
                                value={editMode ? formData.role : userData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                            />
                        </div>

                        <TextField
                            label="Bio"
                            value={editMode ? formData.bio : userData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            disabled={!editMode}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ mt: 3 }}
                        />

                        {editMode && (
                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Security className="text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Security</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-semibold text-gray-900">Password</p>
                                <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                            </div>
                            <Button
                                variant="outlined"
                                onClick={() => setPasswordDialog(true)}
                            >
                                Change Password
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <Switch
                                checked={settings.twoFactorAuth}
                                onChange={() => handleSettingChange('twoFactorAuth')}
                                color="primary"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                            <div>
                                <p className="font-semibold text-red-900">Delete Account</p>
                                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                            </div>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => setDeleteDialog(true)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Notifications className="text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Notifications & Preferences</h3>
                    </div>

                    <div className="space-y-3">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.emailNotifications}
                                    onChange={() => handleSettingChange('emailNotifications')}
                                    color="primary"
                                />
                            }
                            label={
                                <div>
                                    <p className="font-semibold text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-600">Receive email updates about your account</p>
                                </div>
                            }
                        />
                        <Divider />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.pushNotifications}
                                    onChange={() => handleSettingChange('pushNotifications')}
                                    color="primary"
                                />
                            }
                            label={
                                <div>
                                    <p className="font-semibold text-gray-900">Push Notifications</p>
                                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                                </div>
                            }
                        />
                        <Divider />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.marketingEmails}
                                    onChange={() => handleSettingChange('marketingEmails')}
                                    color="primary"
                                />
                            }
                            label={
                                <div>
                                    <p className="font-semibold text-gray-900">Marketing Emails</p>
                                    <p className="text-sm text-gray-600">Receive updates about new features and offers</p>
                                </div>
                            }
                        />
                        <Divider />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.darkMode}
                                    onChange={() => handleSettingChange('darkMode')}
                                    color="primary"
                                />
                            }
                            label={
                                <div>
                                    <p className="font-semibold text-gray-900">Dark Mode</p>
                                    <p className="text-sm text-gray-600">Toggle dark mode appearance</p>
                                </div>
                            }
                        />
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-3">
                    <HelpOutline className="text-blue-600 mt-1" />
                    <div>
                        <p className="font-semibold text-blue-900 mb-1">Need Help?</p>
                        <p className="text-sm text-blue-800">
                            Visit our{' '}
                            <a href="#" className="underline font-medium">
                                Help Center
                            </a>{' '}
                            or{' '}
                            <a href="#" className="underline font-medium">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Change Password Dialog */}
            <Dialog
                open={passwordDialog}
                onClose={() => setPasswordDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-2">
                        <TextField
                            label="Current Password"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            edge="end"
                                        >
                                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="New Password"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            fullWidth
                            helperText="Must be at least 8 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            edge="end"
                                        >
                                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Change Password'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. All your data will be permanently deleted.
                    </Alert>
                    <p className="text-gray-700">
                        Are you sure you want to delete your account? Type your email address to confirm.
                    </p>
                    <TextField
                        label="Email Address"
                        fullWidth
                        sx={{ mt: 2 }}
                        placeholder={userData.email}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error">
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}