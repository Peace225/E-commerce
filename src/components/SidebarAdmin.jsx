// src/components/SidebarAdmin.jsx
import * as Icons from "lucide-react";

export default function SidebarAdmin({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Accueil", icon: Icons.Home, key: "home" },
    { name: "Utilisateurs", icon: Icons.Users, key: "users" },
    { name: "Boutiques", icon: Icons.Store, key: "boutiques" },
    { name: "Commandes", icon: Icons.ShoppingCart, key: "commandes" },
    { name: "Commissions", icon: Icons.Percent, key: "commissions" },
    { name: "Paramètres", icon: Icons.Settings, key: "parametres" },
  ];

  return (
    <aside className="w-64 bg-blue-600 text-white p-6 flex flex-col gap-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">ADMIN PANEL</h1>
      {menuItems.map(item => (
        <button
          key={item.key}
          onClick={() => setActivePage(item.key)}
          className={`flex items-center gap-2 p-2 rounded hover:bg-blue-500 ${
            activePage === item.key ? "bg-blue-500" : ""
          }`}
        >
          <item.icon size={20} />
          {item.name}
        </button>
      ))}
    </aside>
  );
}