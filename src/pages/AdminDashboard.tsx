import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LayoutDashboard,
    FileCheck,
    FileText,
    MessageSquare,
    Users,
    LogOut,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { RegistrationManagement } from "@/components/admin/RegistrationManagement";
import { DocumentManagement } from "@/components/admin/DocumentManagement";
import { ContributionManagement } from "@/components/admin/ContributionManagement";
import { UserManagement } from "@/components/admin/UserManagement";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    const handleLogout = () => {
        localStorage.removeItem('demoAdmin');
        navigate("/admin/login");
    };

    // Statistics Query
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: adminService.getDashboardStats
    });

    // Recent Activity Query (using registrations as proxy for now)
    const { data: recentRegistrations = [], isLoading: activityLoading } = useQuery({
        queryKey: ['recentActivity'],
        queryFn: adminService.getRegistrations
    });

    if (statsLoading || activityLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const defaultStats = {
        registrationsCount: 0,
        pendingRegistrations: 0,
        documentsCount: 0,
        usersCount: 0
    };

    const currentStats = stats || defaultStats;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Dashboard Admin</h1>
                                <p className="text-xs text-muted-foreground">Sama Wareef - Gestion</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Vue d'ensemble</span>
                        </TabsTrigger>
                        <TabsTrigger value="registrations" className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Inscriptions</span>
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">Documents</span>
                        </TabsTrigger>
                        <TabsTrigger value="contributions" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">Contributions</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Utilisateurs</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Vue d'ensemble</h2>
                            <p className="text-muted-foreground">Statistiques et activité récente de la plateforme</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
                                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{currentStats.registrationsCount}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Demandes au Registre du Commerce
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                                    <Clock className="h-4 w-4 text-amber-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-amber-600">{currentStats.pendingRegistrations}</div>
                                    <p className="text-xs text-muted-foreground">
                                        À valider
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                                    <Users className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{currentStats.usersCount}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total inscrits
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{currentStats.documentsCount}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Fichiers uploadés
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activité Récente</CardTitle>
                                <CardDescription>Dernières inscriptions soumises</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(recentRegistrations as any[]).slice(0, 5).map((reg) => (
                                        <div key={reg.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                            <div className={`w-2 h-2 rounded-full ${reg.status === 'pending' ? 'bg-amber-500' :
                                                reg.status === 'approved' ? 'bg-emerald-500' :
                                                    'bg-red-500'
                                                } `} />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">Nouvelle inscription : {reg.full_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Soumis le {new Date(reg.created_at).toLocaleDateString('fr-FR')} à {new Date(reg.created_at).toLocaleTimeString('fr-FR')}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setActiveTab('registrations')}>Voir</Button>
                                        </div>
                                    ))}
                                    {recentRegistrations.length === 0 && (
                                        <p className="text-center text-muted-foreground py-4">Aucune activité récente</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Registrations Tab */}
                    <TabsContent value="registrations">
                        <RegistrationManagement />
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents">
                        <DocumentManagement />
                    </TabsContent>

                    {/* Contributions Tab */}
                    <TabsContent value="contributions">
                        <ContributionManagement />
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <UserManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

