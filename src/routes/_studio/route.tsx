import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyProfile } from "@/lib/server/profile";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_studio")({ component: StudioLayout });

function StudioLayout() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <div className="min-h-dvh bg-canvas p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-40 w-full" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (profile.isPending) {
    return (
      <AppShell>
        <Skeleton className="h-32 w-full" />
      </AppShell>
    );
  }
  if (profile.data && !profile.data.onboarding_completed) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <AppShell
      demoMode={profile.data?.demo_mode}
      isOperator={profile.data?.role === "operator"}
    >
      <Outlet />
    </AppShell>
  );
}
