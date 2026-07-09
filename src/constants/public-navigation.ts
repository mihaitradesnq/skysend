export type PublicNavItem = {
  label: string;
  href:
    | "/"
    | "/how-it-works"
    | "/pricing"
    | "/tracking"
    | "/contact";
};

export const publicNavigation: PublicNavItem[] = [
  { label: "Cum funcționează", href: "/how-it-works" },
  { label: "Tarife", href: "/pricing" },
  { label: "Urmărește comanda", href: "/tracking" },
  { label: "Contact", href: "/contact" },
];
