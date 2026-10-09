import express from 'express';
import {
    sendNotification,
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    getBroadcastHistory,
    getRecipientsDirectory
} from '../controllers/notification.js';
import {
    sendEmailBroadcast,
    getEmailHistory
} from '../controllers/mail.js';

const notificationRoutes = express.Router();

// 1. User Inbox & Actions (Available to any logged-in user - buyer, seller, admin, team member)
notificationRoutes.get('/notifications/my', getMyNotifications);
notificationRoutes.put('/notifications/:id/read', markNotificationRead);
notificationRoutes.put('/notifications/mark-all-read', markAllNotificationsRead);
notificationRoutes.delete('/notifications/:id', deleteNotification);

// 2. Sender / Administrative Broadcast Center (Super Admin, Admin, and active Team Members)
notificationRoutes.post('/notifications/send', sendNotification);
notificationRoutes.get('/notifications/broadcasts', getBroadcastHistory);
notificationRoutes.get('/notifications/directory', getRecipientsDirectory);

// Direct aliases under /admin/notifications for convenience
notificationRoutes.post('/admin/notifications/send', sendNotification);
notificationRoutes.get('/admin/notifications/broadcasts', getBroadcastHistory);
notificationRoutes.get('/admin/notifications/directory', getRecipientsDirectory);

// 3. Administrative Email Broadcast & Direct Nodemailer Routes
notificationRoutes.post('/mail/send', sendEmailBroadcast);
notificationRoutes.get('/mail/history', getEmailHistory);
notificationRoutes.post('/admin/mail/send', sendEmailBroadcast);
notificationRoutes.get('/admin/mail/history', getEmailHistory);

export { notificationRoutes };
