// Reusable canvas signature widget.
// One code path for mouse / finger / stylus via Pointer Events. Strokes are
// stored in normalized [0,1] coordinates so a resize/orientation change can
// redraw them without losing the drawing.

export default class SignaturePad {
  constructor(container, opts = {}) {
    this.container = container;
    this.threshold = opts.threshold ?? 400; // cumulative px of drawn stroke to count as "signed"

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'signature-canvas';
    this.canvas.style.touchAction = 'none';
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.strokes = [];
    this.currentStroke = null;
    this.totalLength = 0;
    this.cssWidth = 0;
    this.cssHeight = 0;

    this._resize = this._resize.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this._resize();
    window.addEventListener('resize', this._resize);
    window.addEventListener('orientationchange', this._resize);

    this.canvas.addEventListener('pointerdown', this._onPointerDown);
    this.canvas.addEventListener('pointermove', this._onPointerMove);
    this.canvas.addEventListener('pointerup', this._onPointerUp);
    this.canvas.addEventListener('pointercancel', this._onPointerUp);
    this.canvas.addEventListener('pointerleave', this._onPointerUp);
  }

  _resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#1b1d23';
    this._redraw();
  }

  _redraw() {
    this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
    for (const stroke of this.strokes) this._drawStroke(stroke);
  }

  _drawStroke(stroke) {
    if (stroke.length < 2) return;
    this.ctx.beginPath();
    stroke.forEach((pt, i) => {
      const x = pt.x * this.cssWidth;
      const y = pt.y * this.cssHeight;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
  }

  _pointFromEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  _onPointerDown(e) {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.currentStroke = [this._pointFromEvent(e)];
    this.strokes.push(this.currentStroke);
  }

  _onPointerMove(e) {
    if (!this.currentStroke) return;
    e.preventDefault();
    const pt = this._pointFromEvent(e);
    const last = this.currentStroke[this.currentStroke.length - 1];
    const dx = (pt.x - last.x) * this.cssWidth;
    const dy = (pt.y - last.y) * this.cssHeight;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return; // skip micro-jitter
    this.currentStroke.push(pt);
    this.totalLength += dist;
    this._redraw();
  }

  _onPointerUp() {
    this.currentStroke = null;
  }

  isSigned() {
    return this.totalLength > this.threshold;
  }

  clear() {
    this.strokes = [];
    this.currentStroke = null;
    this.totalLength = 0;
    this._redraw();
  }

  destroy() {
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('orientationchange', this._resize);
    this.canvas.remove();
  }
}
