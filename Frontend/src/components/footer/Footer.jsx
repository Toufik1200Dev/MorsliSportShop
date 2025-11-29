import { Instagram, Phone, LocationOn } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black border-t border-primary/20 py-8 md:py-12 mt-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h4 className="text-primary font-bold text-xl md:text-2xl mb-4 tracking-wide">
              Morsli Sport
            </h4>
            <p className="text-slate-400 text-sm max-w-[300px]">
              Votre destination de choix pour des équipements sportifs de haute qualité
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h5 className="text-primary font-semibold text-lg mb-2">
              Contactez-nous
            </h5>
            <div className="flex items-center gap-2">
              <Phone className="text-primary text-lg" />
              <span className="text-slate-400 text-sm">+213 672 108 091</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-primary text-lg" />
              <span className="text-slate-400 text-sm">+213 792 390 974</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-primary text-lg" />
              <span className="text-slate-400 text-sm">+213 557 862 386</span>
            </div>
            <div className="flex items-center gap-2">
              <LocationOn className="text-primary text-lg" />
              <span className="text-slate-400 text-sm">Algeria</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h5 className="text-primary font-semibold text-lg mb-2">
              Suivez-nous
            </h5>
            <a
              href="https://www.instagram.com/morsli_sport.shop?igsh=MXg5bzIxMjFvOGluMA=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white flex items-center justify-center border border-primary/30 hover:opacity-90 hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <Instagram className="text-xl" />
            </a>
            <span className="text-slate-400 text-sm">@morsli_sport.shop</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/20 pt-6 mt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 Morsli Sport. Tous droits réservés. Conçu et développé par Toufik Rahmani
          </p>
        </div>
      </div>
    </footer>
  );
}
