import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";

export type Stage = "Applied" | "OA" | "Tech" | "HR" | "Offer";
export const STAGES: Stage[] = ["Applied", "OA", "Tech", "HR", "Offer"];

export type Profile = Tables<"profiles">;
export type Drive = Tables<"drives"> & {
  deadlineIn?: number;
  deadlineLabel?: string;
};
export type Application = Tables<"applications"> & {
  company?: string;
  role?: string;
  history?: Tables<"application_history">[];
};
export type Interview = Tables<"interviews">;
export type PrepTrack = Tables<"prep_tracks">;
export type ProfileCheck = Tables<"profile_checks">;

function daysUntil(deadline: string): number {
  const d = new Date(deadline);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDeadline(deadline: string): string {
  const d = new Date(deadline);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function scoreOf(checks: ProfileCheck[]): number {
  if (!checks.length) return 0;
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const done = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function useSession() {
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof supabase.auth.getSession>
  >["data"]["session"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function useProfile() {
  const { user } = useSession();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useDrives() {
  return useQuery({
    queryKey: ["drives"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drives")
        .select("*")
        .eq("is_active", true)
        .order("deadline", { ascending: true });
      if (error) throw error;
      return (data as Drive[]).map((d) => ({
        ...d,
        deadlineIn: daysUntil(d.deadline),
        deadlineLabel: formatDeadline(d.deadline),
      }));
    },
  });
}

export function useDrive(id: string) {
  return useQuery({
    queryKey: ["drive", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drives")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      const d = data as Drive;
      return {
        ...d,
        deadlineIn: daysUntil(d.deadline),
        deadlineLabel: formatDeadline(d.deadline),
      };
    },
  });
}

export function useApplications() {
  const { user } = useSession();
  return useQuery({
    queryKey: ["applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          drive:drives (company, role),
          history:application_history (*)
        `,
        )
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row: any) => ({
        ...row,
        company: row.drive?.company ?? "",
        role: row.drive?.role ?? "",
        history: (row.history ?? []).sort(
          (a: any, b: any) =>
            new Date(a.happened_at).getTime() - new Date(b.happened_at).getTime(),
        ),
      })) as Application[];
    },
  });
}

export function useInterviews() {
  const { user } = useSession();
  return useQuery({
    queryKey: ["interviews", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user!.id)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return data as Interview[];
    },
  });
}

export function usePrepTracks() {
  const { user } = useSession();
  return useQuery({
    queryKey: ["prep", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prep_tracks")
        .select("*")
        .eq("user_id", user!.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as PrepTrack[];
    },
  });
}

export function useProfileChecks(category?: "github" | "linkedin") {
  const { user } = useSession();
  return useQuery({
    queryKey: ["profile-checks", user?.id, category],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase
        .from("profile_checks")
        .select("*")
        .eq("user_id", user!.id);
      if (category) q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return data as ProfileCheck[];
    },
  });
}

export function useToggleCheck() {
  const qc = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: async ({
      id,
      done,
    }: {
      id: string;
      done: boolean;
    }) => {
      const { error } = await supabase
        .from("profile_checks")
        .update({ done })
        .eq("id", id)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile-checks"] });
    },
  });
}

export function useApplyToDrive() {
  const qc = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: async (driveId: string) => {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          user_id: user!.id,
          drive_id: driveId,
          stage: "Applied",
          status: "active",
          next_action: "Application submitted",
        })
        .select()
        .single();
      if (error) throw error;

      await supabase.from("application_history").insert({
        application_id: data.id,
        stage: "Applied",
        note: "Application submitted",
      });

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["drives"] });
    },
  });
}
