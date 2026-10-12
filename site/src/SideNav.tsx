import { useState } from "react";
import { Box, SearchField, Text } from "@lettuceai/crisp";
import { groups } from "./registry";
import { toHref, useRoute } from "./router";

const linkClass =
  "flex min-h-8 items-center rounded-lg px-3 py-1 text-sm text-fg-3 transition-colors motion-instant hover:bg-fill hover:text-fg aria-[current=page]:bg-fill-2 aria-[current=page]:font-medium aria-[current=page]:text-fg";

function NavLink({ route, children }: { route: string; children: string }) {
  const current = useRoute() === route;
  return (
    <Box as="a" href={toHref(route)} aria-current={current ? "page" : undefined} className={linkClass}>
      {children}
    </Box>
  );
}

const guides = [
  { route: "getting-started", label: "Getting started" },
  { route: "foundations", label: "Foundations" },
  { route: "components", label: "All components" },
];

/** Every page on the site, grouped. The filter narrows the component links only; they stay real anchors either way. */
export function SideNav() {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  return (
    <Box as="nav" aria-label="Documentation" className="flex flex-col gap-5 p-4">
      <SearchField value={query} onChange={setQuery} placeholder="Filter components" aria-label="Filter components" size="sm" />
      {!needle && (
        <Box className="flex flex-col gap-px">
          {guides.map((guide) => (
            <NavLink key={guide.route} route={guide.route}>
              {guide.label}
            </NavLink>
          ))}
        </Box>
      )}
      {groups.map((group) => {
        const items = needle ? group.items.filter((item) => item.name.toLowerCase().includes(needle)) : group.items;
        if (items.length === 0) return null;
        return (
          <Box key={group.id} className="flex flex-col gap-px">
            <Text variant="caption" as="h2" className="px-3 pb-1 font-medium uppercase tracking-[0.14em]">
              {group.title}
            </Text>
            {items.map((item) => (
              <NavLink key={item.slug} route={`components/${item.slug}`}>
                {item.name}
              </NavLink>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
