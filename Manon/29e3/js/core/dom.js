// Tiny DOM helpers — no framework.

/**
 * Create an element.
 * @param {string} tag
 * @param {object} [opts] - { class, attrs, text, html }
 * @param {(Node|string)[]} [children]
 */
export function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);

  if (opts.class) node.className = opts.class;
  if (opts.attrs) {
    for (const [key, value] of Object.entries(opts.attrs)) {
      node.setAttribute(key, value);
    }
  }
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.html !== undefined) node.innerHTML = opts.html;

  for (const child of children) {
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }

  return node;
}

/** Remove all children of a node. */
export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** Add a listener and return a function that removes it (for mount() cleanup). */
export function on(target, type, handler, opts) {
  target.addEventListener(type, handler, opts);
  return () => target.removeEventListener(type, handler, opts);
}
