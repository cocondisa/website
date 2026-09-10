import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import AdminDashboard from "@/components/admin/AdminDashboard";
import DisponibilitesSettings from "@/components/admin/DisponibilitesSettings";
import VacancesCalendar from "@/components/admin/VacancesCalendar";
import BannerSettings from "@/components/admin/BannerSettings";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Espace admin",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <section className="py-16">
      <Container className="flex flex-col gap-14">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-walnut">Espace admin</h1>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex h-full flex-col gap-4">
            <h2 className="text-xl font-semibold text-walnut">
              Disponibilités récurrentes
            </h2>
            <DisponibilitesSettings />
          </div>

          <div className="flex h-full flex-col gap-4">
            <h2 className="text-xl font-semibold text-walnut">Vacances &amp; jours off</h2>
            <VacancesCalendar />
          </div>
        </div>

        <AdminDashboard />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-walnut">Bandeau d&apos;annonce</h2>
          <BannerSettings />
        </div>
      </Container>
    </section>
  );
}
