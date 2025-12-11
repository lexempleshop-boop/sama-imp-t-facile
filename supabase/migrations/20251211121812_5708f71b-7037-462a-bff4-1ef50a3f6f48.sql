-- Admin RLS Policies for full data access

-- 1. Profiles: Admins can view and update all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Expert Requests: Admins can view and update all
CREATE POLICY "Admins can view all expert requests"
ON public.expert_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update expert requests"
ON public.expert_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Documents: Admins can view and update all
CREATE POLICY "Admins can view all documents"
ON public.documents FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all documents"
ON public.documents FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Contributions: Admins can view and update all
CREATE POLICY "Admins can view all contributions"
ON public.fiscalist_contributions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contributions"
ON public.fiscalist_contributions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- 5. User Roles: Admins can view, update and insert roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Storage: Admins can view all files
CREATE POLICY "Admins can view all files"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));