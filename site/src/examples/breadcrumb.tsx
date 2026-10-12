import { Home } from "lucide-react";
import { Breadcrumb } from "@lettuceai/crisp";

export default function BreadcrumbExample() {
  return (
    <Breadcrumb
      maxVisible={2}
      items={[
        { label: "Home", icon: <Home size={14} />, href: "#example" },
        { label: "Settings", href: "#example" },
        { label: "Providers", href: "#example" },
        { label: "OpenAI", href: "#example" },
        { label: "Models" },
      ]}
    />
  );
}
