import express from 'express';
import {
    getAllTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    getPlatformUsers
} from '../controllers/team.js';
import { requireRole } from '../../middlewares/Auth.js';

const teamRoutes = express.Router();

// All team routes require admin or super_admin role
teamRoutes.use(requireRole(['admin', 'super_admin']));

// Get all teams and user search
teamRoutes.get('/admin/teams', getAllTeams);
teamRoutes.get('/admin/teams/users/search', getPlatformUsers);

// Team CRUD
teamRoutes.post('/admin/teams', createTeam);
teamRoutes.put('/admin/teams/:id', updateTeam);
teamRoutes.delete('/admin/teams/:id', deleteTeam);

// Member Management
teamRoutes.post('/admin/teams/:id/members', addMemberToTeam);
teamRoutes.delete('/admin/teams/:id/members/:memberId', removeMemberFromTeam);

export { teamRoutes };
