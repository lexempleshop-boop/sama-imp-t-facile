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
import { FileText, CheckCircle, Eye, Loader2 } from "lucide-react";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function DocumentManagement() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch documents
    const { data: documents = [], isLoading } = useQuery({
        queryKey: ['documents', 'v2'],
        queryFn: adminService.getDocuments
    });

    // Verify mutation
    const verifyMutation = useMutation({
        mutationFn: adminService.verifyDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            toast({
                title: "Document vérifié",
                description: "Le document a été marqué comme vérifié",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de vérifier le document.",
                variant: "destructive",
            });
        }
    });

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'fiscal':
                return <Badge variant="outline" className="bg-blue-100 text-blue-700">Fiscal</Badge>;
            case 'reference':
                return <Badge variant="outline" className="bg-purple-100 text-purple-700">Référence</Badge>;
            default:
                return <Badge variant="outline">Autre</Badge>;
        }
    };

    const getFileUrl = (path: string) => {
        if (!path) return '#';
        return supabase.storage.from('documents').getPublicUrl(path).data.publicUrl;
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Documents Uploadés</CardTitle>
                <CardDescription>
                    Revue et validation des documents fiscaux
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom du Fichier</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Uploadé par</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Aucun document trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                documents.map((doc: any) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                {doc.file_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getTypeBadge(doc.document_category)}</TableCell>
                                        <TableCell>{doc.profiles?.full_name || 'Inconnu'}</TableCell>
                                        <TableCell>
                                            {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell>
                                            {doc.status === 'validated' ? (
                                                <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Vérifié
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-amber-100 text-amber-700">
                                                    En attente
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={getFileUrl(doc.file_path)} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Voir
                                                    </a>
                                                </Button>
                                                {doc.status !== 'validated' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => verifyMutation.mutate(doc.id)}
                                                        disabled={verifyMutation.isPending}
                                                    >
                                                        {verifyMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                                                        Vérifier
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
