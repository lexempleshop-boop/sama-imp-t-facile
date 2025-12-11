import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Eye, FileText, CreditCard, Loader2 } from "lucide-react";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function RegistrationManagement() {
    const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch registrations
    const { data: registrations = [], isLoading } = useQuery({
        queryKey: ['registrations'],
        queryFn: adminService.getRegistrations
    });

    // Mutations
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: 'approved' | 'rejected' }) =>
            adminService.updateRegistrationStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            toast({
                title: "Succès",
                description: "Le statut a été mis à jour.",
            });
            setSelectedRegistration(null);
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le statut.",
                variant: "destructive",
            });
        }
    });

    const filteredRegistrations = registrations.filter((reg: any) => {
        if (filter === 'all') return true;
        return reg.status === filter;
    });

    // Helper to extract info from additional_info JSON
    const getInfo = (reg: any) => {
        try {
            return typeof reg.additional_info === 'string'
                ? JSON.parse(reg.additional_info)
                : reg.additional_info;
        } catch (e) {
            return {};
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">En attente</Badge>;
            case 'approved':
                return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">Approuvé</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Rejeté</Badge>;
            default:
                return null;
        }
    };

    const getFileUrl = (path: string) => {
        if (!path) return '#';
        // Get public URL for viewing
        return supabase.storage.from('documents').getPublicUrl(path).data.publicUrl;
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Demandes d'Inscription au Registre du Commerce</CardTitle>
                    <CardDescription>
                        Gérez et validez les demandes d'inscription
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
                        <TabsList>
                            <TabsTrigger value="all">Tous ({registrations.length})</TabsTrigger>
                            <TabsTrigger value="pending">
                                En attente ({registrations.filter((r: any) => r.status === 'pending').length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                Approuvés ({registrations.filter((r: any) => r.status === 'approved').length})
                            </TabsTrigger>
                            <TabsTrigger value="rejected">
                                Rejetés ({registrations.filter((r: any) => r.status === 'rejected').length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom Complet</TableHead>
                                    <TableHead>Téléphone</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Paiement</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRegistrations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            Aucune demande trouvée
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRegistrations.map((reg: any) => {
                                        const info = getInfo(reg);
                                        return (
                                            <TableRow key={reg.id}>
                                                <TableCell className="font-medium">
                                                    {reg.full_name}
                                                </TableCell>
                                                <TableCell>{reg.phone}</TableCell>
                                                <TableCell>
                                                    {new Date(reg.created_at).toLocaleDateString('fr-FR')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <CreditCard className="w-3 h-3" />
                                                        <span className="text-xs capitalize">
                                                            {info?.payment_method || 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(reg.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedRegistration(reg)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Détails
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Détails de la Demande</DialogTitle>
                        <DialogDescription>
                            Informations complètes et documents fournis
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRegistration && (
                        <div className="space-y-6">
                            {/* Personal Info */}
                            <div>
                                <h3 className="font-semibold mb-3">Informations Personnelles</h3>
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Nom Complet</p>
                                        <p className="font-medium">{selectedRegistration.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="font-medium">{selectedRegistration.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Téléphone</p>
                                        <p className="font-medium">{selectedRegistration.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date de soumission</p>
                                        <p className="font-medium">
                                            {new Date(selectedRegistration.created_at).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="font-semibold mb-3">Informations de Paiement</h3>
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Mode de paiement</p>
                                        <p className="font-medium capitalize">
                                            {getInfo(selectedRegistration)?.payment_method || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Numéro de paiement</p>
                                        <p className="font-medium">{getInfo(selectedRegistration)?.payment_phone || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground">Montant</p>
                                        <p className="font-medium text-lg">25 000 FCFA</p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h3 className="font-semibold mb-3">Documents Fournis</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Carte Nationale d'Identité</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={getFileUrl(selectedRegistration.ninea_path)} target="_blank" rel="noopener noreferrer">Voir</a>
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Certificat de Résidence</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={getFileUrl(selectedRegistration.fiscal_attestation_path)} target="_blank" rel="noopener noreferrer">Voir</a>
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Bail Commercial</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={getFileUrl(selectedRegistration.professional_card_path)} target="_blank" rel="noopener noreferrer">Voir</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h3 className="font-semibold mb-3">Statut Actuel</h3>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    {getStatusBadge(selectedRegistration.status)}
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedRegistration.status === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        className="flex-1"
                                        onClick={() => updateStatusMutation.mutate({ id: selectedRegistration.id, status: 'approved' })}
                                        disabled={updateStatusMutation.isPending}
                                    >
                                        {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                        Approuver
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => updateStatusMutation.mutate({ id: selectedRegistration.id, status: 'rejected' })}
                                        disabled={updateStatusMutation.isPending}
                                    >
                                        {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                                        Rejeter
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
