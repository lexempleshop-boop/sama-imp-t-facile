-- ==============================================================================
-- STRATÉGIE DE SÉCURITÉ ADMIN (RLS)
-- Ce script ajoute les politiques manquantes pour permettre aux admins de tout voir.
-- ==============================================================================

-- 1. Accès complet aux PROFILES pour les admins
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update users"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Accès complet aux DEMANDES D'EXPERTS (Inscriptions)
CREATE POLICY "Admins can view all expert requests"
ON public.expert_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update expert requests"
ON public.expert_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Accès complet aux DOCUMENTS (Base de données)
CREATE POLICY "Admins can view all documents"
ON public.documents FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
ON public.documents FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Accès complet aux CONTRIBUTIONS
CREATE POLICY "Admins can view all contributions"
ON public.fiscalist_contributions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contributions"
ON public.fiscalist_contributions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Accès complet aux USER_ROLES
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ==============================================================================
-- POLITIQUES DE STOCKAGE (STORAGE BUCKETS)
-- ==============================================================================

-- Permettre aux admins de voir TOUS les fichiers dans 'documents'
CREATE POLICY "Admins can view all files"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));
