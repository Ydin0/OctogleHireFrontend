import { redirect } from "next/navigation";

// The standalone "Browse Developers" placeholder is superseded by the
// Discover console (the dashboard landing). Send companies there.
export default function BrowseDevelopersPage() {
  redirect("/companies/dashboard");
}
