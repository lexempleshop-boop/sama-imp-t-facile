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
import { CheckCircle, XCircle, Eye, MessageSquare, Loader2 } from "lucide-react";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export function ContributionManagement() {
    const [selectedContribution, setSelectedContribution] = useState<any>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch contributions
    const { data: contributions = [], isLoading } = useQuery({
        queryKey: ['contributions', 'v2'],
        queryFn: adminService.getContributions
    });

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: 'validated' | 'rejected' }) =>
            adminService.updateContributionStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contributions'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            toast({
                title: "Succès",
                description: "Le statut a été mis à jour.",
            });
            setSelectedContribution(null);
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le statut.",
                variant: "destructive",
            });
        }
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-amber-100 text-amber-700">En attente</Badge>;
            case 'validated':
                return <Badge variant="outline" className="bg-emerald-100 text-emerald-700">Approuvé</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-100 text-red-700">Rejeté</Badge>;
            default:
                return null;
        }
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Contributions des Fiscalistes</CardTitle>
                    <CardDescription>
                        Corrections et suggestions soumises par les experts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Soumis par</TableHead>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contributions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            Aucune contribution trouvée
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contributions.map((contrib: any) => (
                                        <TableRow key={contrib.id}>
                                            <TableCell className="font-medium">
                                                {contrib.profiles?.full_name || 'Inconnu'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm line-clamp-1">{contrib.title}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">{contrib.contribution_type}</TableCell>
                                            <TableCell>
                                                {new Date(contrib.created_at).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(contrib.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedContribution(contrib)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Détails
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={!!selectedContribution} onOpenChange={() => setSelectedContribution(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails de la Contribution</DialogTitle>
                        <DialogDescription>
                            Correction ou suggestion soumise
                        </DialogDescription>
                    </DialogHeader>

                    {selectedContribution && (
                        <div className="space-y-6">
                            {/* Contributor Info */}
                            <div>
                                <h3 className="font-semibold mb-3">Informations</h3>
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Soumis par</p>
                                        <p className="font-medium">{selectedContribution.profiles?.full_name || 'Inconnu'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date</p>
                                        <p className="font-medium">
                                            {new Date(selectedContribution.created_at).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Type</p>
                                        <p className="font-medium capitalize">{selectedContribution.contribution_type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contribution Text */}
                            <div>
                                <h3 className="font-semibold mb-3">{selectedContribution.title}</h3>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <p className="text-sm whitespace-pre-wrap">{selectedContribution.content || 'Aucun contenu texte'}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h3 className="font-semibold mb-3">Statut Actuel</h3>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    {getStatusBadge(selectedContribution.status)}
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedContribution.status === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button
                                        className="flex-1"
                                        onClick={() => updateStatusMutation.mutate({ id: selectedContribution.id, status: 'validated' })}
                                        disabled={updateStatusMutation.isPending}
                                    >
                                        {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                        Approuver
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => updateStatusMutation.mutate({ id: selectedContribution.id, status: 'rejected' })}
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
