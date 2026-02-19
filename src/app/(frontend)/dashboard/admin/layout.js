import { AuthProvider } from "@/lib/components/context";
import AdminMenu from "./AdminMenu";
export const metadata = {
  title: {
    default: "Admin dashboard",
    template: "%s | Admin dashboard | Blog",
    // absolute:""
  },
  description: "A blog website",
};
export default function AdminLayout({ children }) {
  return (
    <div className=" grid md:grid-cols-12 gap-2">
      <div className="col-span-12 md:col-span-3 card">
        <AdminMenu />
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}
