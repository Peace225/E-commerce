import { Search } from "lucide-react";

export default function HeaderDashboard({ user, handleUploadPhoto, searchTerm, setSearchTerm }) {
  return (
    <header className="flex flex-col gap-6 mb-8">
      {/* Top section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">Tableau de bord</h2>
            <p className="text-lg text-gray-500 dark:text-white">Bienvenue, {user?.email || "Utilisateur"}</p>

            <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition">
              📷 Modifier la photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPhoto}
              />
            </label>
          </div>
        </div>

        {/* Avatar utilisateur */}
        <div className="relative">
          <img
            src={user?.photoURL || "https://ui-avatars.com/api/?name=User"}
            alt="Profil utilisateur"
            className="w-12 h-12 rounded-full object-cover border shadow cursor-pointer hover:scale-105 hover:ring-2 hover:ring-green-400 transition-transform"
          />
        </div>
      </div>

      {/* Search input */}
      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Rechercher une boutique..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
      </div>
    </header>
  );
}