import { Prose } from "@lettuceai/crisp";

const markdown = `## Release notes

Crisp renders **markdown** on its own type scale, with \`inline code\` and links like [the docs](#example).

- Lists stay tidy
- Tables, too

| Token | Use |
| --- | --- |
| fg | Primary text |
| fg-3 | Muted text |

> Raw HTML is not enabled.
`;

export default function ProseExample() {
  return (
    <div className="w-full max-w-lg">
      <Prose>{markdown}</Prose>
    </div>
  );
}
