import { supabase } from "@/integrations/supabase/client";

export const adminService = {
    // --- STATS ---
    async getDashboardStats() {
        const { count: registrationsCount } = await supabase
            .from('expert_requests')
            .select('*', { count: 'exact', head: true })
            // We use ilike because additional_info is a text column, not JSONB
            .ilike('additional_info', '%commerce_registration%');

        const { count: pendingRegistrations } = await supabase
            .from('expert_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
            .ilike('additional_info', '%commerce_registration%');

        const { count: documentsCount } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true });

        const { count: usersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        return {
            registrationsCount: registrationsCount || 0,
            pendingRegistrations: pendingRegistrations || 0,
            documentsCount: documentsCount || 0,
            usersCount: usersCount || 0
        };
    },

    // --- REGISTRATIONS (Using expert_requests table) ---
    async getRegistrations() {
        // Note: In a real app we would paginate this.
        const { data, error } = await supabase
            .from('expert_requests')
            .select('*')
            // Filter for commerce registrations using ilike for text column
            .ilike('additional_info', '%commerce_registration%')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Client-side filtering as a fallback if necessary, or to be safe
        return data.filter(req => {
            try {
                const info = typeof req.additional_info === 'string'
                    ? JSON.parse(req.additional_info)
                    : req.additional_info;
                return info?.type === 'commerce_registration';
            } catch (e) {
                return false;
            }
        });
    },

    async updateRegistrationStatus(id: string, status: 'approved' | 'rejected') {
        const { error } = await supabase
            .from('expert_requests')
            .update({ status: status })
            .eq('id', id);

        if (error) throw error;
    },

    // --- DOCUMENTS ---
    async getDocuments() {
        // Fetch documents
        const { data: documents, error: docsError } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (docsError) throw docsError;

        // Fetch profiles to manually join (since FK might be missing)
        const userIds = [...new Set(documents.map(d => d.user_id))];
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);

        if (profilesError) {
            console.warn("Could not fetch profiles for documents:", profilesError);
            return documents; // Return documents without names if profiles fail
        }

        // Merge data
        return documents.map(doc => ({
            ...doc,
            profiles: profiles?.find(p => p.id === doc.user_id) || { full_name: 'Utilisateur inconnu' }
        }));
    },

    async verifyDocument(id: string) {
        const { error } = await supabase
            .from('documents')
            .update({ status: 'validated' })
            .eq('id', id);

        if (error) throw error;
    },

    // --- CONTRIBUTIONS ---
    async getContributions() {
        // Fetch contributions
        const { data: contributions, error: contribError } = await supabase
            .from('fiscalist_contributions')
            .select('*')
            .order('created_at', { ascending: false });

        if (contribError) throw contribError;

        // Fetch profiles manually
        const userIds = [...new Set(contributions.map(c => c.user_id))];
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);

        if (profilesError) {
            console.warn("Could not fetch profiles for contributions:", profilesError);
            return contributions;
        }

        return contributions.map(contrib => ({
            ...contrib,
            profiles: profiles?.find(p => p.id === contrib.user_id) || { full_name: 'Utilisateur inconnu' }
        }));
    },

    async updateContributionStatus(id: string, status: 'validated' | 'rejected') {
        const { error } = await supabase
            .from('fiscalist_contributions')
            .update({ status: status })
            .eq('id', id);

        if (error) throw error;
    },

    // --- USERS ---
    async getUsers() {
        // Fetch profiles and roles
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*');

        if (profilesError) throw profilesError;

        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*');

        if (rolesError) throw rolesError;

        // Merge data
        return profiles.map(profile => {
            const userRoleRef = roles.find(r => r.user_id === profile.user_id);
            return {
                ...profile,
                role: userRoleRef?.role || 'citizen'
            };
        });
    }
};
