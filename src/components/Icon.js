import * as Icons from "lucide-react";

// Resolve um ícone do lucide pelo nome (string) com fallback.
export function Icon({ name, ...props }) {
  const Cmp = Icons[name] || Icons.Wrench;
  return <Cmp {...props} />;
}
