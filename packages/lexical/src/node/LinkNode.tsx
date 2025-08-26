import { addClassNamesToElement } from "@lexical/utils";
import {
  $applyNodeReplacement,
  $isRangeSelection,
  ElementNode,
  isHTMLAnchorElement,
  type BaseSelection,
  type BaseStaticNodeConfig,
  type DOMConversionMap,
  type DOMConversionOutput,
  type EditorConfig,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type RangeSelection,
  type SerializedElementNode,
  type Spread,
} from "lexical";

export type LinkAttributes = {
  rel?: string | null;
  target?: string | null;
  title?: string | null;
};
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

  createDome(config: EditorConfig) {
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
