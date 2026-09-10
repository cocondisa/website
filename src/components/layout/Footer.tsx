import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { contact, siteConfig, social } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-walnut text-parchment">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Logo variant="white" />
            <p className="mt-4 text-sm text-parchment/80">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-peach">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-parchment/80">
              <li>
                <a href={contact.telephoneHref} className="hover:text-peach">
                  {contact.telephone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-peach">
                  {contact.email}
                </a>
              </li>
              <li>{contact.adresseCabinet}</li>
              <li>{contact.zone}</li>
            </ul>
            <div className="mt-4 flex gap-4">
              <a
                href={social.instagram}
                aria-label="Instagram de Cocon d'Isa"
                className="text-parchment/80 hover:text-peach"
              >
                Instagram
              </a>
              <a
                href={social.facebook}
                aria-label="Facebook de Cocon d'Isa"
                className="text-parchment/80 hover:text-peach"
              >
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-peach">
              Informations légales
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-parchment/80">
              <li>
                <Link href="/mentions-legales" className="hover:text-peach">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="hover:text-peach">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-parchment/20 pt-6 text-xs text-parchment/60">
          © {year} {siteConfig.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
