import { describe, expect, it } from "bun:test";
import { getElementRef, mergeRefs } from "./ref";

describe("mergeRefs", () => {
  it("calls multiple callback refs with the element", () => {
    let ref1Node: unknown = null;
    let ref2Node: unknown = null;
    const ref1 = (node: unknown) => { ref1Node = node; };
    const ref2 = (node: unknown) => { ref2Node = node; };

    const merged = mergeRefs(ref1, ref2);
    const mockElement = { tagName: "DIV" };
    merged(mockElement as unknown as HTMLElement);

    expect(ref1Node).toBe(mockElement);
    expect(ref2Node).toBe(mockElement);

    merged(null);
    expect(ref1Node).toBeNull();
    expect(ref2Node).toBeNull();
  });

  it("updates mutable RefObject instances", () => {
    const refObj = { current: null as unknown };
    const merged = mergeRefs(refObj);
    const mockElement = { tagName: "DIV" };

    merged(mockElement as unknown as HTMLElement);
    expect(refObj.current).toBe(mockElement);

    merged(null);
    expect(refObj.current).toBeNull();
  });

  it("handles null and undefined refs without error", () => {
    let called = false;
    const ref = () => { called = true; };
    const merged = mergeRefs(null, undefined, ref);
    const mockElement = { tagName: "DIV" };

    merged(mockElement as unknown as HTMLElement);
    expect(called).toBe(true);
  });
});

describe("getElementRef", () => {
  it("extracts ref from React 19 props.ref", () => {
    const dummyRef = { current: null };
    const element = { props: { ref: dummyRef } };
    expect(getElementRef(element)).toBe(dummyRef);
  });

  it("extracts ref from React 18 element.ref", () => {
    const dummyRef = () => {};
    const element = { ref: dummyRef, props: {} };
    expect(getElementRef(element)).toBe(dummyRef);
  });

  it("returns undefined when no ref is present", () => {
    expect(getElementRef({ props: {} })).toBeUndefined();
    expect(getElementRef(null)).toBeUndefined();
    expect(getElementRef(undefined)).toBeUndefined();
  });
});
