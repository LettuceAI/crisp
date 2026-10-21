import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ConnectedTree, type ConnectedTreeNode } from "./ConnectedTree";

const nodes: ConnectedTreeNode[] = [
  {
    id: "root",
    title: "Harbour",
    onSelect: () => undefined,
    children: [
      { id: "a", title: "Dock fight", description: "3 messages", current: true, onSelect: () => undefined },
      { id: "b", title: "Storm", content: <input aria-label="Name" />, children: [{ id: "c", title: "Calm" }] },
    ],
  },
];

const html = renderToStaticMarkup(<ConnectedTree aria-label="Branches" nodes={nodes} />);
const items = html.split("<li").slice(1);

describe("ConnectedTree", () => {
  it("nests children under their parent and labels the list", () => {
    expect(html).toContain('aria-label="Branches"');
    expect(items).toHaveLength(4);
    expect(html.match(/<ul/g)).toHaveLength(3);
    expect(items[0]).toContain("Harbour");
    expect(items[0]).not.toContain("before:");
    expect(html.indexOf("Dock fight")).toBeGreaterThan(html.indexOf("Harbour"));
    expect(html.indexOf("Calm")).toBeGreaterThan(html.indexOf("Dock fight"));
  });

  it("marks the current node and makes only selectable nodes buttons", () => {
    expect(html).toContain('aria-current="true"');
    expect(html.match(/<button/g)).toHaveLength(2);
    expect(html).toContain("3 messages");
  });

  it("swaps a node's card for its content and keeps its children", () => {
    expect(html).toContain('<input aria-label="Name"/>');
    expect(html).not.toContain(">Storm<");
    expect(html).toContain("Calm");
  });

  it("draws a line into every nested node and ends the rail at the last one", () => {
    expect(items[1]).toContain("before:-bottom-2");
    expect(items[2]).toContain("before:h-7.5");
    expect(items[3]).toContain("before:h-7.5");
    expect(items[1]).toContain("after:w-3");
  });
});
