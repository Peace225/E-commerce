import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AlertMessage from "../components/AlertMessage";
import { ShoppingBag, Store, MessageCircle, Loader2, CreditCard, FileText, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🎛️ États Généraux (Rôle harmonisé : 'acheteur' ou 'vendeur')
  const [accountType, setAccountType] = useState("acheteur");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [refCode, setRefCode] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ Visibilité du mot de passe

  // 👤 États Spécifiques VENDEUR
  const [nomBoutique, setNomBoutique] = useState("");
  const [categorieBoutique, setCategorieBoutique] = useState("");

  // 📄 États Documents, Paiements & Contrat (Vendeur Pro)
  const [documentType, setDocumentType] = useState("cni");
  const [documentNumber, setDocumentNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setRefCode(refFromUrl);
  }, [searchParams]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    if (accountType === "vendeur" && !acceptTerms) {
      setAlert("❌ Vous devez accepter le contrat de confidentialité pour créer une boutique.");
      setLoading(false);
      return;
    }

    try {
      // Configuration de l'affichage de l'identité publique
      const displayNameFinal = accountType === "acheteur" ? `Client ${telephone}` : nomBoutique;
      
      // 🎯 Génération de l'identifiant d'authentification technique
      const finalEmail = accountType === "acheteur" ? `${telephone.trim()}@rynek.ci` : email.trim();

      const payload = {
        role: accountType,
        full_name: displayNameFinal,
        whatsapp: telephone.trim(),
        referral_code_used: refCode,
        ...(accountType === "vendeur" && {
          boutique_category: categorieBoutique,
          legal_document_type: documentType,
          legal_document_number: documentNumber,
          payout_method: paymentMethod,
          payout_details: paymentDetails,
          vendeur_nda_accepted: acceptTerms
        })
      };

      const { data, error } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: { data: payload }
      });

      if (error) throw error;

      if (data.session) {
        setAlert(`🎉 Compte ${accountType === "acheteur" ? "Acheteur" : "Vendeur Pro"} créé avec succès ! Préparation de votre espace...`);
        setTimeout(() => {
          if (accountType === "vendeur") navigate("/dashboard");
          else navigate("/mon-compte");
        }, 2000);
      } else {
        setAlert(accountType === "acheteur" ? "🎉 Compte créé avec succès !" : "🎉 Compte créé ! Un e-mail d'activation vous a été envoyé.");
        setTimeout(() => navigate("/login"), accountType === "acheteur" ? 2000 : 4000);
      }

    } catch (error) {
      console.error("Erreur Inscription Supabase:", error.message);
      const isAlreadyUsed = error.message.includes("already registered") || error.message.includes("already exists");
      setAlert("❌ " + (isAlreadyUsed ? "Ce numéro ou e-mail est déjà utilisé." : "Une erreur est survenue lors de l'inscription."));
    } finally {
      setLoading(false);
    }
  };

  const isClient = accountType === "acheteur";
  const accent = isClient ? "from-amber-500 to-orange-600" : "from-violet-600 to-indigo-600";
  const accentRing = isClient ? "focus:ring-orange-500/20 focus:border-orange-500" : "focus:ring-indigo-500/20 focus:border-indigo-500";

  return (
    <>
      <Helmet>
        <title>Inscription Rynek | Acheteur ou Vendeur Pro</title>
        <meta name="description" content="Rejoignez Rynek. Créez votre compte client pour acheter ou votre compte vendeur pour booster vos ventes." />
      </Helmet>

      <div className="min-h-screen relative flex items-center justify-center px-4 py-10 bg-[#0a0b0f] overflow-hidden">
        {/* premium background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-600/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />
        </div>

        <div className="w-full max-w-xl relative">
          {alert && <div className="mb-4"><AlertMessage message={alert} onClose={() => setAlert("")} /></div>}

          <form onSubmit={handleRegister} className="relative backdrop-blur-xl bg-white/[0.04] border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)] rounded-[2.5rem] p-7 sm:p-10 space-y-7">
            <div className={`pointer-events-none absolute -inset-px rounded-[2.5rem] bg-gradient-to-b ${accent} opacity-20 blur-2xl`} />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur">
                <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${accent} animate-pulse`} />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/70">Rynek Premium</span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-[2.1rem] font-black tracking-tight text-white">Créer votre compte</h1>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-white/50">Choisissez votre profil pour commencer</p>
            </div>

            {/* Sélecteur de profil */}
            <div className="relative grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-black/30 border border-white/10">
              <button type="button" onClick={() => setAccountType("acheteur")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${isClient ? "text-white" : "text-white/50 hover:text-white/80"}`}>
                {isClient && <span className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-inner" />}
                <ShoppingBag size={22} className={isClient ? "" : "opacity-70"} />
                <span className="text-xs font-bold uppercase tracking-widest">Acheteur</span>
              </button>
              <button type="button" onClick={() => setAccountType("vendeur")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${!isClient ? "text-white" : "text-white/50 hover:text-white/80"}`}>
                {!isClient && <span className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-inner" />}
                <Store size={22} className={!isClient ? "" : "opacity-70"} />
                <span className="text-xs font-bold uppercase tracking-widest">Vendeur Pro</span>
              </button>
            </div>

            {/* Formulaires dynamiques */}
            <div className="space-y-4">
              {isClient ? (
                /* 🛒 BLOC ACHETEUR NETTOYÉ (UNIQUEMENT LE NUMÉRO WHATSAPP) */
                <div className="space-y-4">
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input type="tel" required placeholder="Numéro WhatsApp (Ex: 0700000000)" onChange={(e) => setTelephone(e.target.value)}
                      autoComplete="tel"
                      className={`w-full bg-black/40 border border-white/10 text-white placeholder-white/40 p-4 pl-12 rounded-2xl text-sm outline-none transition-all ${accentRing} focus:ring-4`} />
                  </div>
                </div>
              ) : (
                /* 🏪 BLOC VENDEUR PRO (COMPLET AVEC CONTRAT INSTITUTIONNEL) */
                <div className="space-y-4">
                  <input type="text" required placeholder="Nom de la Boutique" onChange={(e) => setNomBoutique(e.target.value)}
                    autoComplete="organization"
                    className={`w-full bg-black/40 border border-white/10 text-white placeholder-white/40 p-4 rounded-2xl text-sm outline-none transition-all ${accentRing} focus:ring-4`} />

                  <select required onChange={(e) => setCategorieBoutique(e.target.value)}
                    className={`w-full bg-black/40 border border-white/10 text-white/90 p-4 rounded-2xl text-sm outline-none transition-all ${accentRing} focus:ring-4`}>
                    <option value="" className="bg-black">Catégorie Boutique...</option>
                    <option value="mode" className="bg-black">Mode & Beauté</option>
                    <option value="high-tech" className="bg-black">Électronique & High-Tech</option>
                    <option value="alimentation" className="bg-black">Restauration / Alimentation</option>
                    <option value="automobile" className="bg-black">Automobile</option>
                  </select>

                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input type="tel" required placeholder="WhatsApp de la boutique" onChange={(e) => setTelephone(e.target.value)}
                      autoComplete="tel"
                      className={`w-full bg-black/40 border border-white/10 text-white placeholder-white/40 p-4 pl-12 rounded-2xl text-sm outline-none transition-all ${accentRing} focus:ring-4`} />
                  </div>

                  <input type="email" required placeholder="Adresse Email Professionnelle" onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={`w-full bg-black/40 border border-white/10 text-white placeholder-white/40 p-4 rounded-2xl text-sm outline-none transition-all ${accentRing} focus:ring-4`} />

                  {/* Vérification légale */}
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <FileText size={13} /> Vérification légale
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}
                        className="col-span-1 bg-black/50 border border-white/10 text-white/80 p-3 rounded-xl text-xs outline-none">
                        <option value="cni" className="bg-black">CNI</option>
                        <option value="passeport" className="bg-black">Passeport</option>
                        <option value="registre_commerce" className="bg-black">RCCM</option>
                      </select>
                      <input type="text" required placeholder={documentType === "registre_commerce" ? "N° RCCM" : "N° pièce"}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        className="col-span-2 bg-black/50 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl text-xs outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  {/* Paiement */}
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <CreditCard size={13} /> Versement des revenus
                    </p>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                      {["mobile_money", "virement_bancaire"].map(m => (
                        <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                          className={`py-2.5 rounded-lg text-xs font-semibold transition-all ${paymentMethod === m ? "bg-white text-black" : "text-white/60 hover:text-white"}`}>
                          {m === "mobile_money" ? "Mobile Money" : "Virement"}
                        </button>
                      ))}
                    </div>
                    <input type="text" required placeholder={paymentMethod === "mobile_money" ? "Wave / Orange (N° + Nom)" : "Banque, Guichet, N° compte, IBAN"}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl text-xs outline-none focus:border-indigo-500" />
                  </div>

                  {/* Contrat Premium, NDA & Structure de Commission */}
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <FileText size={13} /> Conditions Générales & Accord de Confidentialité (NDA)
                    </p>
                    <div className="h-48 overflow-y-auto bg-black/40 rounded-xl border border-white/10 p-4 text-xs leading-relaxed text-white/70 space-y-3 custom-scrollbar text-justify">
                      <div>
                        <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 text-amber-500">PRÉAMBULE</p>
                        <p>Le présent contrat constitue un accord juridique contraignant entre la plateforme RYNEK et le Vendeur Professionnel. L'activation du compte vaut acceptation sans réserve des clauses de distribution financière, de propriété intellectuelle et de confidentialité définies ci-dessous.</p>
                      </div>

                      <div>
                        <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 text-amber-500">1. INGÉNIERIE FINANCIÈRE & MODÈLE DE COMMISSIONNEMENT</p>
                        <p>Rynek opère en qualité de tiers de confiance pour le compte du Vendeur. Le modèle économique repose sur un prélèvement à la source lors de chaque transaction validée. La ventilation des flux s'exécute de manière automatisée selon la formule structurelle suivante :</p>
                        <div className="bg-black/60 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-amber-400 my-2 text-center">
                          Revenu Net Vendeur = Prix Public TTC - (Commission Plateforme + Commission Affiliation)
                        </div>
                        <ul className="list-disc pl-4 space-y-1.5 text-white/60">
                          <li><strong className="text-white">Commission Institutionnelle Plateforme :</strong> Un taux fixe et non négociable de **8%** est appliqué sur le volume d'affaires brut. Ce prélèvement finance le cryptage des transactions, l'hébergement de l'infrastructure et la maintenance corrective du Dashboard Pro.</li>
                          <li><strong className="text-white">Frais de Stimulation (Système d'Affiliation) :</strong> Afin de bénéficier de la force de vente du réseau Rynek, le Vendeur s'engage à définir un taux de rétrocession pour les apporteurs d'affaires (Affiliés). Ce taux est obligatoirement compris dans une fourchette de **5% à 20%**, paramétrable par article depuis son espace de gestion.</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 text-amber-500">2. ACCORD STRICT DE CONFIDENTIALITÉ & PROTECTION DES ALGORITHMES (NDA)</p>
                        <p>Le Vendeur est soumis à une obligation de secret absolu, survivant à la rupture des présentes relations contractuelles. Sont expressément considérées comme informations confidentielles :</p>
                        <ul className="list-disc pl-4 space-y-1 text-white/60">
                          <li>Les structures logiques des dashboards, les bases de données, l'architecture e-commerce et les algorithmes de mise en relation développés par Rynek.</li>
                          <li>L'ensemble des données à caractère personnel des Acheteurs (noms, coordonnées de livraison, numéros). Toute extraction, exploitation en dehors du cadre de la livraison Rynek, ou revente de ces données entraînera des poursuites judiciaires immédiates.</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 text-amber-500">3. SÉQUESTRE DES REVENUS & DROIT DE RÉTENTION</p>
                        <p>La plateforme Rynek conserva les fonds sous séquestre technique jusqu'à la confirmation de livraison effective et l'expiration du délai de réclamation de l'Acheteur. En cas de suspicion de fraude ou de produit contrefait, Rynek se réserve le droit d'activer un gel conservatoire du solde vendeur.</p>
                      </div>

                      <div>
                        <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 text-amber-500">4. RESPONSABILITÉ JURIDIQUE & FISCALE</p>
                        <p>Le Vendeur conserve l'entière responsabilité éditoriale, commerciale et fiscale de ses ventes. Il certifie l'exactitude des pièces justificatives fournies lors de son inscription (CNI, Passeport ou RCCM).</p>
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group pt-1">
                      <input type="checkbox" required checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/50 text-indigo-600 focus:ring-indigo-500 transition-colors" />
                      <span className="text-[11px] text-white/70 group-hover:text-white transition-colors select-none">
                        Je certifie avoir pris connaissance des clauses contractuelles, j'approuve les modalités de commissionnement tripartite et je signe cet accord de confidentialité.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* 👁️ CHAMP DE SÉCURITÉ : MOT DE PASSE UNIQUE */}
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  autoComplete="new-password"
                  placeholder="Mot de passe" 
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-black/40 border border-white/10 text-white placeholder-white/40 p-4 pr-12 rounded-2xl text-sm outline-none transition-all ${accentRing} focus:ring-4`} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Bouton de validation dynamique */}
            <button type="submit" disabled={loading || (!isClient && !acceptTerms)}
              className={`group relative w-full overflow-hidden rounded-2xl py-4 font-bold uppercase tracking-widest text-xs text-white transition-all active:scale-[0.99] disabled:opacity-60`}>
              <span className={`absolute inset-0 bg-gradient-to-r ${accent} transition-opacity group-hover:opacity-90`} />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_white,_transparent_60%)]" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : `Créer mon compte ${accountType === "acheteur" ? "Acheteur" : "Vendeur Pro"}`}
              </span>
            </button>

            <p className="text-center text-xs text-white/50">
              Déjà membre ? <Link to="/login" className="text-white hover:underline underline-offset-4">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}