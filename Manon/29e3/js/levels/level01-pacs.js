import { el, clear, on } from '../core/dom.js';
import SignaturePad from '../core/SignaturePad.js';

// TODO: remplacer par les vraies informations avant publication.
const PARTIES = {
  a: 'PRÉNOM NOM A',
  b: 'PRÉNOM NOM B',
  date: 'JJ/MM/AAAA',
  commune: 'COMMUNE',
};

// TODO: relire/ajuster le ton et le contenu de chaque clause.
// `expected: true`  -> doit être cochée pour valider le document.
// `expected: false` -> clause absurde, doit rester décochée.
const CLAUSES = [
  {
    id: 'c1',
    text: "Les partenaires optent pour le régime de la séparation de biens (art. 515-5 du code civil).",
    expected: true,
  },
  {
    id: 'c2',
    text: 'Les partenaires s’engagent à un soutien matériel et moral réciproque.',
    expected: true,
  },
  {
    id: 'c3',
    text: `Le partenaire A renonce définitivement à tout avis sur le choix du canapé.`,
    expected: false,
  },
  {
    id: 'c4',
    text: `Les partenaires élisent domicile commun à ${PARTIES.commune} à compter du ${PARTIES.date}.`,
    expected: true,
  },
  {
    id: 'c5',
    text: 'En cas de désaccord, tout litige est tranché par un duel de regards, au meilleur des trois manches.',
    expected: false,
  },
  {
    id: 'c6',
    text: 'Les partenaires s’engagent à se supporter mutuellement, y compris un dimanche pluvieux sans rien à faire.',
    expected: true,
  },
  {
    id: 'c7',
    text: `Le présent acte autorise le partenaire B à gagner systématiquement au Monopoly.`,
    expected: false,
  },
  {
    id: 'c8',
    text: 'Les partenaires reconnaissent avoir lu l’intégralité du présent acte.',
    expected: true,
  },
  {
    id: 'c9',
    text: 'Le PACS confère automatiquement la garde exclusive de la télécommande à l’un des partenaires, désigné par tirage au sort.',
    expected: false,
  },
];

const RESET_DELAY_MS = 1200;

export default {
  id: 'pacs',
  number: 1,
  title: 'Le PACS',
  teaser: 'Mars',
  css: 'css/levels/level01.css',
  assets: { images: [], audio: [] },

  mount(root, ctx) {
    const cleanups = [];
    let attempt = 1;
    let signaturePad = null;
    let resetTimeoutId = null;

    const checkboxRefs = new Map();

    const clauseRows = CLAUSES.map((clause) => {
      const checkbox = el('input', { attrs: { type: 'checkbox', id: `pacs-${clause.id}` } });
      checkboxRefs.set(clause.id, checkbox);
      const row = el('label', { class: 'pacs-clause', attrs: { for: `pacs-${clause.id}` } }, [
        checkbox,
        el('span', { class: 'pacs-clause-box' }),
        el('span', { class: 'pacs-clause-text', text: clause.text }),
      ]);
      return row;
    });

    const attemptEl = el('div', { class: 'pacs-attempt', text: `Tentative n°${attempt}` });
    const stampEl = el('div', { class: 'pacs-stamp' });
    const signatureContainer = el('div', { class: 'pacs-signature-pad' });

    const clearSignatureBtn = el(
      'button',
      { class: 'pacs-link-btn', attrs: { type: 'button' } },
      ['Effacer la signature'],
    );

    const submitBtn = el(
      'button',
      { class: 'pacs-submit-btn', attrs: { type: 'button' } },
      ['Valider'],
    );

    const documentCard = el('div', { class: 'pacs-document' }, [
      stampEl,
      el('div', { class: 'pacs-doc-header' }, [
        el('div', { class: 'pacs-doc-eyebrow', text: 'RÉPUBLIQUE FRANÇAISE' }),
        el('h3', { class: 'pacs-doc-title', text: 'Convention de Pacte Civil de Solidarité' }),
      ]),
      el('div', { class: 'pacs-doc-body' }, [
        el('p', {
          class: 'pacs-doc-intro',
          text: `Entre les soussignés, ${PARTIES.a} et ${PARTIES.b}, il est convenu ce qui suit. ` +
            'Le lecteur est invité à cocher chaque clause qu’il approuve, et elle seule.',
        }),
        el('div', { class: 'pacs-clauses' }, clauseRows),
        el('div', { class: 'pacs-signature-block' }, [
          el('div', { class: 'pacs-signature-label', text: 'Signature :' }),
          signatureContainer,
          clearSignatureBtn,
        ]),
      ]),
    ]);

    const footer = el('div', { class: 'pacs-footer' }, [attemptEl, submitBtn]);

    const view = el('div', { class: 'pacs-level' }, [documentCard, footer]);
    root.appendChild(view);

    // Mount the signature pad after the container has real layout dimensions.
    signaturePad = new SignaturePad(signatureContainer, { threshold: 300 });

    const showStamp = (label, kind) => {
      stampEl.textContent = label;
      stampEl.className = `pacs-stamp pacs-stamp--${kind} pacs-stamp--visible`;
    };

    const hideStamp = () => {
      stampEl.className = 'pacs-stamp';
    };

    const resetForm = () => {
      for (const checkbox of checkboxRefs.values()) checkbox.checked = false;
      signaturePad.clear();
      hideStamp();
      documentCard.classList.remove('pacs-shake');
    };

    const handleSubmit = () => {
      if (resetTimeoutId) return; // already resolving a previous attempt

      const allCorrect = CLAUSES.every(
        (clause) => checkboxRefs.get(clause.id).checked === clause.expected,
      );
      const signed = signaturePad.isSigned();

      if (allCorrect && signed) {
        showStamp('VALIDÉ', 'success');
        submitBtn.disabled = true;
        const doneMessage = el('p', {
          class: 'pacs-done-message',
          text: 'C’est signé. Une nouvelle aventure commence.',
        });
        const backBtn = el(
          'button',
          { class: 'pacs-submit-btn', attrs: { type: 'button' } },
          ['Retour'],
        );
        footer.replaceChildren(doneMessage, backBtn);
        const offBack = on(backBtn, 'click', () => ctx.complete());
        cleanups.push(offBack);
        return;
      }

      showStamp('REFUSÉ', 'failure');
      documentCard.classList.add('pacs-shake');

      resetTimeoutId = window.setTimeout(() => {
        resetTimeoutId = null;
        resetForm();
        attempt += 1;
        attemptEl.textContent = `Tentative n°${attempt}`;
      }, RESET_DELAY_MS);
    };

    cleanups.push(on(submitBtn, 'click', handleSubmit));
    cleanups.push(on(clearSignatureBtn, 'click', () => signaturePad.clear()));

    return () => {
      if (resetTimeoutId) window.clearTimeout(resetTimeoutId);
      for (const off of cleanups) off();
      if (signaturePad) signaturePad.destroy();
      clear(root);
    };
  },
};
