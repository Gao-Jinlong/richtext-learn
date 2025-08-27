import { $findMatchingParent, addClassNamesToElement } from "@lexical/utils";
import { invariant } from "es-toolkit";
import {
  $applyNodeReplacement,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $normalizeSelection__EXPERIMENTAL,
  $setSelection,
  createCommand,
  ElementNode,
  isHTMLAnchorElement,
  type BaseSelection,
  type BaseStaticNodeConfig,
  type DOMConversionMap,
  type DOMConversionOutput,
  type EditorConfig,
  type LexicalCommand,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type Point,
  type RangeSelection,
  type SerializedElementNode,
  type Spread,
} from "lexical";

export type LinkAttributes = {
  rel?: string | null;
  target?: string | null;
  title?: string | null;
};
export type AutoLinkAttributes = Partial<
  Spread<LinkAttributes, { isUnlinked?: boolean }>
>;
export type SerializedLinkNode = Spread<
  { url: string },
  Spread<LinkAttributes, SerializedElementNode>
>;

export type LinkHTMLElementType = HTMLAnchorElement | HTMLSpanElement;

const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

export class LinkNode extends ElementNode {
  __url: string;
  __target: null | string;
  __rel: null | string;
  __title: null | string;

  $config(): BaseStaticNodeConfig {
    return this.config("link", { extends: ElementNode });
  }

  static clone(node: LinkNode): LinkNode {
    return new LinkNode(
      node.__url,
      {
        rel: node.__rel,
        target: node.__target,
        title: node.__title,
      },
      node.__key
    );
  }

  constructor(
    url: string = "",
    attributes: LinkAttributes = {},
    key?: NodeKey
  ) {
    super(key);
    this.__url = url;
    this.__target = attributes.target ?? null;
    this.__rel = attributes.rel ?? null;
    this.__title = attributes.title ?? null;
  }

  createDOM(config: EditorConfig): LinkHTMLElementType {
    const element = document.createElement("a");
    this.updateLinkDOM(null, element, config);
    addClassNamesToElement(element, config.theme.link);
    return element;
  }

  updateLinkDOM(
    prevNode: this | null,
    anchor: LinkHTMLElementType,
    _config: EditorConfig
  ) {
    if (isHTMLAnchorElement(anchor)) {
      if (!prevNode || prevNode.__url !== this.__url) {
        anchor.href = this.sanitizeUrl(this.__url);
      }
      for (const attr of ["target", "rel", "title"] as const) {
        const key = `__${attr}` as const;
        const value = this[key];
        if (!prevNode || prevNode[key] !== value) {
          if (value) {
            anchor[attr] = value;
          } else {
            anchor.removeAttribute(attr);
          }
        }
      }
    }
  }

  updateDOM(prevNode: this, anchor: LinkHTMLElementType, config: EditorConfig) {
    this.updateLinkDOM(prevNode, anchor, config);
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (_node: Node) => {
        return {
          conversion: $convertAnchorElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedLinkNode): LinkNode {
    return $createLinkNode().updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedLinkNode>): this {
    return super
      .updateFromJSON(serializedNode)
      .setURL(serializedNode.url)
      .setRel(serializedNode.rel || null)
      .setTarget(serializedNode.target || null)
      .setTitle(serializedNode.title || null);
  }

  sanitizeUrl(url: string) {
    url = formatUrl(url);
    try {
      const parsedUrl = new URL(formatUrl(url));
      if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
        return "about:blank";
      }
    } catch {
      return url;
    }

    return url;
  }

  exportJSON(): SerializedLinkNode | SerializedAutoLinkNode {
    return {
      ...super.exportJSON(),
      rel: this.getRel(),
      target: this.getTarget(),
      title: this.getTitle(),
      url: this.getURL(),
    };
  }

  getURL() {
    return this.getLatest().__url;
  }
  setURL(url: string) {
    const writable = this.getWritable();
    writable.__url = url;
    return writable;
  }
  getRel() {
    return this.getLatest().__rel;
  }
  setRel(rel: string | null) {
    const writable = this.getWritable();
    writable.__rel = rel;
    return writable;
  }
  getTarget(): null | string {
    return this.getLatest().__target;
  }
  setTarget(target: null | string): this {
    const writable = this.getWritable();
    writable.__target = target;
    return writable;
  }
  getTitle(): null | string {
    return this.getLatest().__title;
  }
  setTitle(title: null | string): this {
    const writable = this.getWritable();
    writable.__title = title;
    return writable;
  }
  insertNewAfter(
    _: RangeSelection,
    restoreSelection = true
  ): null | ElementNode {
    const linkNode = $createLinkNode(this.__url, {
      rel: this.__rel,
      target: this.__target,
      title: this.__title,
    });
    this.insertAfter(linkNode, restoreSelection);
    return linkNode;
  }
  canInsertTextBefore(): false {
    return false;
  }
  canInsertTextAfter(): false {
    return false;
  }
  canBeEmpty(): false {
    return false;
  }
  isInline(): true {
    return true;
  }

  extractWithChild(
    _child: LexicalNode,
    selection: BaseSelection,
    _destination: "clone" | "html"
  ): boolean {
    if (!$isRangeSelection(selection)) {
      return false;
    }

    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();

    return (
      this.isParentOf(anchorNode) &&
      this.isParentOf(focusNode) &&
      selection.getTextContent().length > 0
    );
  }

  isEmailURI(): boolean {
    return this.__url.startsWith("mailto:");
  }
  isWebSiteURI(): boolean {
    return (
      this.__url.startsWith("https://") || this.__url.startsWith("http://")
    );
  }
}

function $convertAnchorElement(domNode: Node): DOMConversionOutput {
  let node = null;
  if (isHTMLAnchorElement(domNode)) {
    const content = domNode.textContent;
    if ((content !== null && content !== "") || domNode.children.length > 0) {
      node = $createLinkNode(domNode.getAttribute("href") || "", {
        rel: domNode.getAttribute("rel") || null,
        target: domNode.getAttribute("target") || null,
        title: domNode.getAttribute("title") || null,
      });
    }
  }
  return { node };
}

export function $createLinkNode(
  url: string = "",
  attributes?: LinkAttributes
): LinkNode {
  return $applyNodeReplacement(new LinkNode(url, attributes));
}

export function $isLinkNode(
  node: LexicalNode | null | undefined
): node is LinkNode {
  return node instanceof LinkNode;
}

export type SerializedAutoLinkNode = Spread<
  { isUnlinked: boolean },
  SerializedLinkNode
>;

export class AutoLinkNode extends LinkNode {
  __isUnlinked: boolean;
  constructor(
    url: string = "",
    attributes: AutoLinkAttributes = {},
    key?: NodeKey
  ) {
    super(url, attributes, key);
    this.__isUnlinked =
      attributes.isUnlinked !== undefined && attributes.isUnlinked !== null
        ? attributes.isUnlinked
        : false;
  }

  $config(): BaseStaticNodeConfig {
    return this.config("autolink", { extends: LinkNode });
  }

  static clone(node: AutoLinkNode): AutoLinkNode {
    return new AutoLinkNode(
      node.__url,
      {
        isUnlinked: node.__isUnlinked,
        rel: node.__rel,
        target: node.__target,
        title: node.__title,
      },
      node.__key
    );
  }

  getIsUnlinked(): boolean {
    return this.__isUnlinked;
  }
  setIsUnlinked(value: boolean): this {
    const self = this.getWritable();
    self.__isUnlinked = value;
    return self;
  }
  createDOM(config: EditorConfig): LinkHTMLElementType {
    if (this.__isUnlinked) {
      return document.createElement("span");
    } else {
      return super.createDOM(config);
    }
  }
  updateDOM(
    prevNode: this,
    anchor: LinkHTMLElementType,
    config: EditorConfig
  ): boolean {
    return (
      super.updateDOM(prevNode, anchor, config) ||
      prevNode.__isUnlinked !== this.__isUnlinked
    );
  }
  static importJSON(serializedNode: SerializedAutoLinkNode): AutoLinkNode {
    return $createAutoLinkNode().updateFromJSON(serializedNode);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedAutoLinkNode>
  ): this {
    return super
      .updateFromJSON(serializedNode)
      .setIsUnlinked(serializedNode.isUnlinked || false);
  }
  static importDOM(): null {
    // TODO: Implement importDOM for AutoLinkNode
    return null;
  }

  exportJSON(): SerializedAutoLinkNode {
    return {
      ...super.exportJSON(),
      isUnlinked: this.__isUnlinked,
    };
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true
  ): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(
      selection,
      restoreSelection
    );

    if ($isElementNode(element)) {
      const linkNode = $createAutoLinkNode(this.__url, {
        isUnlinked: this.__isUnlinked,
        rel: this.__rel,
        target: this.__target,
        title: this.__title,
      });
      element.append(linkNode);
      return linkNode;
    }
    return null;
  }
}

export function $createAutoLinkNode(
  url: string = "",
  attributes?: AutoLinkAttributes
): AutoLinkNode {
  return $applyNodeReplacement(new AutoLinkNode(url, attributes));
}

export function $isAutoLinkNode(
  node: LexicalNode | null | undefined
): node is AutoLinkNode {
  return node instanceof AutoLinkNode;
}

export const TOGGLE_LINK_COMMAND: LexicalCommand<
  string | ({ url: string } & LinkAttributes) | null
> = createCommand("TOGGLE_LINK_COMMAND");

function $getPointNode(point: Point, offset: number): LexicalNode | null {
  if (point.type === "element") {
    const node = point.getNode();
    invariant(
      $isElementNode(node),
      "$getPointNode: element point is not an ElementNode"
    );
    const children = node.getChildren()[point.offset + offset];
    return children || null;
  }

  return null;
}

function $withSelectedNodes<T>($fn: () => T) {
  const initialSelection = $getSelection();
  if (!$isRangeSelection(initialSelection)) {
    return $fn();
  }
  const normalized = $normalizeSelection__EXPERIMENTAL(initialSelection);
  const isBackwards = normalized.isBackward();
  const anchorNode = $getPointNode(normalized.anchor, isBackwards ? -1 : 0);
  const focusNode = $getPointNode(normalized.focus, isBackwards ? 0 : -1);
  const rval = $fn();
  if (anchorNode || focusNode) {
    const updatedSelection = $getSelection();
    if ($isRangeSelection(updatedSelection)) {
      const finalSelection = updatedSelection.clone();
      if (anchorNode) {
        const anchorParent = anchorNode.getParent();
        if (anchorParent) {
          finalSelection.anchor.set(
            anchorParent.getKey(),
            anchorNode.getIndexWithinParent() + (isBackwards ? 1 : 0),
            "element"
          );
        }
      }
      if (focusNode) {
        const focusParent = focusNode.getParent();
        if (focusParent) {
          finalSelection.focus.set(
            focusParent.getKey(),
            focusNode.getIndexWithinParent() + (isBackwards ? 0 : 1),
            "element"
          );
        }
      }
      $setSelection($normalizeSelection__EXPERIMENTAL(finalSelection));
    }
  }
  return rval;
}

/**
 * Generates or updates a LinkNode. It can also delete a LinkNode if the URL is null,
 * but saves any children and brings them up to the parent node.
 * @param url - The URL the link directs to.
 * @param attributes - Optional HTML a tag attributes. \\{ target, rel, title \\}
 */
export function $toggleLink(
  url: null | string,
  attributes: LinkAttributes = {}
): void {
  const { target, title } = attributes;
  const rel = attributes.rel === undefined ? "noreferrer" : attributes.rel;
  const selection = $getSelection();

  if (
    selection === null ||
    (!$isRangeSelection(selection) && !$isNodeSelection(selection))
  ) {
    return;
  }

  if ($isNodeSelection(selection)) {
    const nodes = selection.getNodes();
    if (nodes.length === 0) {
      return;
    }

    // Handle all selected nodes
    nodes.forEach((node) => {
      if (url === null) {
        // Remove link
        const linkParent = $findMatchingParent(
          node,
          (parent): parent is LinkNode =>
            !$isAutoLinkNode(parent) && $isLinkNode(parent)
        );
        if (linkParent) {
          linkParent.insertBefore(node);
          if (linkParent.getChildren().length === 0) {
            linkParent.remove();
          }
        }
      } else {
        // Add/Update link
        const existingLink = $findMatchingParent(
          node,
          (parent): parent is LinkNode =>
            !$isAutoLinkNode(parent) && $isLinkNode(parent)
        );
        if (existingLink) {
          existingLink.setURL(url);
          if (target !== undefined) {
            existingLink.setTarget(target);
          }
          if (rel !== undefined) {
            existingLink.setRel(rel);
          }
        } else {
          const linkNode = $createLinkNode(url, { rel, target });
          node.insertBefore(linkNode);
          linkNode.append(node);
        }
      }
    });
    return;
  }

  // Handle RangeSelection
  const nodes = selection.extract();

  if (url === null) {
    // Remove LinkNodes
    nodes.forEach((node) => {
      const parentLink = $findMatchingParent(
        node,
        (parent): parent is LinkNode =>
          !$isAutoLinkNode(parent) && $isLinkNode(parent)
      );

      if (parentLink) {
        const children = parentLink.getChildren();

        for (let i = 0; i < children.length; i++) {
          parentLink.insertBefore(children[i]);
        }

        parentLink.remove();
      }
    });
    return;
  }
  const updatedNodes = new Set<NodeKey>();
  const updateLinkNode = (linkNode: LinkNode) => {
    if (updatedNodes.has(linkNode.getKey())) {
      return;
    }
    updatedNodes.add(linkNode.getKey());
    linkNode.setURL(url);
    if (target !== undefined) {
      linkNode.setTarget(target);
    }
    if (rel !== undefined) {
      linkNode.setRel(rel);
    }
    if (title !== undefined) {
      linkNode.setTitle(title);
    }
  };
  // Add or merge LinkNodes
  if (nodes.length === 1) {
    const firstNode = nodes[0];
    // if the first node is a LinkNode or if its
    // parent is a LinkNode, we update the URL, target and rel.
    const linkNode = $getAncestor(firstNode, $isLinkNode);
    if (linkNode !== null) {
      return updateLinkNode(linkNode);
    }
  }

  $withSelectedNodes(() => {
    let linkNode: LinkNode | null = null;
    for (const node of nodes) {
      if (!node.isAttached()) {
        continue;
      }
      const parentLinkNode = $getAncestor(node, $isLinkNode);
      if (parentLinkNode) {
        updateLinkNode(parentLinkNode);
        continue;
      }
      if ($isElementNode(node)) {
        if (!node.isInline()) {
          // Ignore block nodes, if there are any children we will see them
          // later and wrap in a new LinkNode
          continue;
        }
        if ($isLinkNode(node)) {
          // If it's not an autolink node and we don't already have a LinkNode
          // in this block then we can update it and re-use it
          if (
            !$isAutoLinkNode(node) &&
            (linkNode === null || !linkNode.getParentOrThrow().isParentOf(node))
          ) {
            updateLinkNode(node);
            linkNode = node;
            continue;
          }
          // Unwrap LinkNode, we already have one or it's an AutoLinkNode
          for (const child of node.getChildren()) {
            node.insertBefore(child);
          }
          node.remove();
          continue;
        }
      }
      const prevLinkNode = node.getPreviousSibling();
      if ($isLinkNode(prevLinkNode) && prevLinkNode.is(linkNode)) {
        prevLinkNode.append(node);
        continue;
      }
      linkNode = $createLinkNode(url, { rel, target, title });
      node.insertAfter(linkNode);
      linkNode.append(node);
    }
  });
}
export const toggleLink = $toggleLink;
function $getAncestor<NodeType extends LexicalNode = LexicalNode>(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => ancestor is NodeType
) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null && !predicate(parent)) {
    parent = parent.getParentOrThrow();
  }
  return predicate(parent) ? parent : null;
}
const PHONE_NUMBER_REGEX = /^\+?[0-9\s()-]{5,}$/;
export function formatUrl(url: string) {
  // Check if URL already has a protocol
  if (url.match(/^[a-z][a-z0-9+.-]*:/i)) {
    // URL already has a protocol, leave it as is
    return url;
  }
  // Check if it's a relative path (starting with '/', '.', or '#')
  else if (url.match(/^[/#.]/)) {
    // Relative path, leave it as is
    return url;
  }

  // Check for email address
  else if (url.includes("@")) {
    return `mailto:${url}`;
  }

  // Check for phone number
  else if (PHONE_NUMBER_REGEX.test(url)) {
    return `tel:${url}`;
  }

  // For everything else, return with https:// prefix
  return `https://${url}`;
}
