import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Always attempt real Supabase authentication first
            const { error } = await signIn(email, password);

            if (error) {
                console.error("Login error:", error);
                toast({
                    title: "Erreur de connexion",
                    description: "Email ou mot de passe incorrect",
                    variant: "destructive",
                });
            } else {
                // If login successful, check role in DB
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // Check if user has admin role in 'user_roles'
                    const { data: roleData, error: roleError } = await supabase
                        .from('user_roles')
                        .select('role')
                        .eq('user_id', user.id)
                        .single();

                    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 means no rows found
                        console.error("Error fetching user role:", roleError);
                        toast({
                            title: "Erreur de base de données",
                            description: "Impossible de vérifier le rôle de l'utilisateur.",
                            variant: "destructive",
                        });
                        setIsLoading(false);
                        return;
                    }

                    if (!roleData || roleData.role !== 'admin') {
                        // AUTO-FIX: Try to insert admin role if missing (only works if RLS allows)
                        // This corresponds to the user's manual setup of "admin@sama.sn"
                        if (email === "admin@sama.sn") {
                            const { error: insertError } = await supabase
                                .from('user_roles')
                                .insert([{ user_id: user.id, role: 'admin' }]);

                            if (insertError) {
                                console.error("Could not auto-assign admin role:", insertError);
                                toast({
                                    title: "Attention",
                                    description: "Ce compte n'a pas le rôle 'admin' dans la base de données. Les données pourraient être masquées.",
                                    variant: "destructive",
                                });
                                setIsLoading(false);
                                return;
                            } else {
                                toast({
                                    title: "Configuration réussie",
                                    description: "Rôle administrateur attribué à ce compte.",
                                });
                            }
                        } else {
                            toast({
                                title: "Accès limité",
                                description: "Ce compte n'a pas les droits d'administrateur.",
                                variant: "destructive",
                            });
                            setIsLoading(false);
                            return;
                        }
                    }

                    // Also ensure profile exists
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    if (!profile && email === "admin@sama.sn") {
                        await supabase.from('profiles').insert([{
                            id: user.id,
                            full_name: 'Super Admin',
                            email: email
                        }]);
                    }
                } else {
                    toast({
                        title: "Erreur de connexion",
                        description: "Impossible de récupérer les informations utilisateur après la connexion.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem('demoAdmin', 'true');

                toast({
                    title: "Connexion réussie",
                    description: "Bienvenue dans l'espace administrateur",
                });
                navigate("/admin/dashboard");
            }
        } catch (error) {
            toast({
                title: "Erreur inattendue",
                description: "Une erreur est survenue lors de la connexion",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Espace Administrateur</CardTitle>
                        <CardDescription>
                            Connectez-vous pour accéder au tableau de bord
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@sama.sn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                            <p className="font-medium mb-1">Compte de démonstration :</p>
                            <p>Email: admin@sama.sn</p>
                            <p>Mot de passe: admin123</p>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
