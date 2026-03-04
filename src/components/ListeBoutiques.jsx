import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion"; // 🔥

export default function ListeBoutiques({ boutiques, onDelete, onEdit }) {
  return (
    <section className="mt-8 bg-white border rounded shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        🛒 Dernières boutiques créées
      </h2>

      {boutiques.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aucune boutique enregistrée pour le moment.
        </p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm table-auto" role="table" aria-label="Liste des boutiques">
              <thead className="bg-gray-50 text-left text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2">Logo</th>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Thème</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {boutiques.map((b) => (
                  <tr key={b.id || b.nom} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">
                      {b.logoUrl ? (
                        <img
                          src={b.logoUrl}
                          alt={`Logo de ${b.nom}`}
                          className="h-10 w-10 object-cover rounded-full border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-800">{b.nom || "Sans nom"}</td>
                    <td className="px-4 py-2 text-gray-600">{b.description || "—"}</td>
                    <td className="px-4 py-2">
                      {b.theme ? (
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                        >
                          🎨 {b.theme}
                        </motion.span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {b.createdAt?.toDate
                        ? dayjs(b.createdAt.toDate()).format("DD MMM YYYY")
                        : "Non défini"}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => onEdit(b)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                      >
                        <Pencil size={14} className="mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => onDelete(b)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {boutiques.map((b) => (
              <div key={b.id || b.nom} className="border rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-white">
                <div className="flex items-center gap-4">
                  {b.logoUrl ? (
                    <img
                      src={b.logoUrl}
                      alt={`Logo de ${b.nom}`}
                      className="h-12 w-12 object-cover rounded-full border"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{b.nom || "Sans nom"}</h3>
                    <p className="text-xs text-gray-500">
                      {b.createdAt?.toDate
                        ? dayjs(b.createdAt.toDate()).format("DD MMM YYYY")
                        : "Non défini"}
                    </p>
                  </div>
                </div>

                {b.theme && (
                  <div className="flex justify-start mt-2">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                    >
                      🎨 {b.theme}
                    </motion.span>
                  </div>
                )}

                <p className="text-sm text-gray-600">{b.description || "—"}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onEdit(b)}
                    className="flex-1 flex items-center justify-center px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                  >
                    <Pencil size={14} className="mr-1" />
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(b)}
                    className="flex-1 flex items-center justify-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}