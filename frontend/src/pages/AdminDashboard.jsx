import { useState, useEffect } from "react";
import { Users, Folder, ClipboardList } from "lucide-react";

import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";
import { getUsers } from "../services/userService";

import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardRecentProjects from "../components/Dashboard/DashboardRecentProjects";
import DashboardTeam from "../components/Dashboard/DashboardTeam";
import DashboardActivities from "../components/Dashboard/DashboardActivities";
import DashboardTasks from "../components/Dashboard/DashboardTasks";
import InviteForm from "../components/Admin/InviteForm";
import InviteList from "../components/Admin/InviteList";

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, t, m] = await Promise.all([
                    getProjects(),
                    getTasks(),
                    getUsers()
                ]);
                setProjects(p);
                setTasks(t);
                setMembers(m);
            } catch (error) {
                console.error("Failed to load admin dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const dashboardStats = [
        { id: 1, name: "Total Projects", value: projects.length.toString(), change: "+2.5%", changeType: "increase", icon: Folder, gradient: "from-blue-500 to-cyan-500" },
        { id: 2, name: "Active Tasks", value: tasks.filter(t => t.status !== 'Completed').length.toString(), change: "-4.2%", changeType: "decrease", icon: ClipboardList, gradient: "from-purple-500 to-pink-500" },
        { id: 3, name: "Team Members", value: members.length.toString(), change: "+12.5%", changeType: "increase", icon: Users, gradient: "from-amber-500 to-orange-500" }
    ];

    const dashboardRecentProjects = [...projects].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const dashboardTeamMembers = members.slice(0, 5);
    const dashboardTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 5);
    const [showInvite, setShowInvite] = useState(false);
    const [refreshInvites, setRefreshInvites] = useState(0);
    
    // Generate activities from projects and tasks
    const projectActivities = projects.map(p => ({
        user: p.owner?.name || "Admin",
        action: "created project",
        target: p.title,
        time: new Date(p.createdAt).toLocaleDateString(),
        avatar: p.owner?.avatar,
        timestamp: new Date(p.createdAt)
    }));

    const taskActivities = tasks.map(t => ({
        user: t.assignees?.[0]?.name || "Team Member",
        action: t.status === 'Completed' ? "completed task" : "updated task",
        target: t.title,
        time: new Date(t.updatedAt).toLocaleDateString(),
        avatar: t.assignees?.[0]?.avatar,
        timestamp: new Date(t.updatedAt)
    }));

    const dashboardActivities = [...projectActivities, ...taskActivities]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 8);

    if (loading) {
        return <div className="p-6">Loading Dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setShowInvite(true)} className="px-4 py-2 rounded-lg bg-pink-500 text-white">Create Invite</button>
            </div>
            <DashboardStats stats={dashboardStats} />
            {showInvite && (
                <InviteForm onClose={() => setShowInvite(false)} onCreated={() => setRefreshInvites(prev => prev + 1)} />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DashboardRecentProjects projects={dashboardRecentProjects} />
                    <DashboardActivities activities={dashboardActivities} />
                </div>
                <div className="space-y-6">
                    <DashboardTeam members={dashboardTeamMembers} />
                    <DashboardTasks tasks={dashboardTasks} />
                    <InviteList key={refreshInvites} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
