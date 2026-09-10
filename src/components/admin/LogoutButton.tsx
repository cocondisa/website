"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleLogout}>
      Se déconnecter
    </Button>
  );
}
