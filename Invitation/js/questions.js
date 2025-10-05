const INTRO_DIALOGUE = [
    "Simon: \"XXX, j'ai besoin de ton aide !\"",
    "Simon: \"Manon a tout préparé pour le PACS et je n'ai rien suivi\"",
    "Simon: \"Il faut que tu m'aides à retrouver les infos pour les invitations !\""
];

const LEVEL_DIALOGUES = {
    0: [
        "Manon: \"Simon, tu t'es occupé des invitations ?\"",
        "Simon: \"Je suis dessus !\""
    ],
    1: [
        "Manon: \"Bon, maintenant que tu sais quand\"",
        "Simon: \"Ah oui, il faut aussi leur dire où !\""
    ],
    2: [
        "Manon: \"Et pour le repas ?\"",
        "Simon: \"Euh\""
    ],
    3: [
        "Manon: \"Oublie pas de leur dire de pas se ramener en clodo !\"",
        "Simon: \"Pourquoi ? On s'en fiche non ?\""
    ],
    4: [
        "Manon: \"Ils ont toutes les infos ?\"",
        "Simon: \"Je crois\""
    ],
    5: [
        "Manon: \"Tu as pensé à ceux qui venaient en voiture ?\"",
        "Simon: \"Bien sûr !\""
    ],
    6: [
        "Manon: \"Tu n'as pas l'impression qu'il manque quelque chose ?\"",
        "Simon: \"Ah non mais ça j'y pensais, promis !\""
    ]
};

const LEVEL_QUESTIONS = {
    // Level 1 - Basic rocks and enemies
    0: [
        {
            question: "Simon: \"Quand est-ce qu'on fête ça avec les copains déjà ?\"",
            options: [
                "Demain ! Il n'est jamais trop tôt pour faire la fête !",
                "En octobre, juste avant halloween, pour commencer un peu plus tôt la journée de l'horreur",
                "En novembre, un peu comme un cadeau de Noël en avance"
            ],
            correctAnswer: 2
        },
        {
            question: "Manon: \"Bravo mais la date exacte, ça pourrait les intéresser\"",
            options: [
                "Le 8 comme le nombre d'année passées ensemble",
                "Le 15, comme le sport de l'ovalie",
                "Le 22, comme notre âge quand on s'est rencontrés"
            ],
            correctAnswer: 2
        }
    ],
    // Level 2 - Introduction to traps
    1: [
        {
            question: "Simon: \"C'est où la fête ?\"",
            options: [
                "On a privatisé le chateau pour l'occasion, non ?",
                "Dans notre demeure à Versailles",
                "Dans ton cul"
            ],
            correctAnswer: 1
        },
        {
            question: "Manon: \"Pense à leur donner l'adresse !\"",
            options: [
                "66 avenue des États Unis, 78000 Versailles",
                "3 Rue de Satory, 78000 Versailles",
                "11 Rue Exelmans, 78000 Versailles"
            ],
            correctAnswer: 0
        }
    ],
    // Level 3 - Keys and chests
    2: [
        {
            question: "Simon: \"On mange quoi ?\"",
            options: [
                "Fromages, charcuterie et plein de bonnes choses",
                "De la raclette !",
                "Du foie gras. Le gras c'est la vie."
            ],
            correctAnswer: 0
        }
    ],
    // Level 4 - Complex trap and rock puzzle
    3: [
        {
            question: "Simon: \"Niveau dress code, ...\"",
            options: [
                "Du moment qu'on a le cul propre...",
                "Tout le monde en queue de pie, c'est Versailles ici !",
                "On évite les t-shirts, les jeans troués et les surverts"
            ],
            correctAnswer: 2
        },
        {
            question: "Simon: \"Donc si je viens en maillot de bain ou en carapuce, ça passe ?\"",
            options: [
                "Non, habits corrects exigés !",
                "Seulement si c'est un slip de bain",
                "Ben oui, ça va avec la consigne"
            ],
            correctAnswer: 0
        }
    ],
    // Level 5 - Trap timing
    4: [
        {
            question: "Simon: \"Ah non ! Ils doivent rapporter quoi ?\"",
            options: [
                "Leur fions et leur bonne humeur",
                "De l'alcool pardi !",
                "Une charette de bouses, ça pourrait être sympa"
            ],
            correctAnswer: 0
        }
    ],
    // Level 6 - Complex movement puzzle
    5: [
        {
            question: "Simon: \"Pour se garer, le mieux c'est ?\"",
            options: [
                "Rue de la ceinture (gratuit) et Bd de la république (payant)",
                "Dans le parking du chateau, c'est pas loin",
                "Il y a un parking privé dans la résidence"
            ],
            correctAnswer: 0
        }
    ],
    // Level 7 - Final challenge
    6: [
        {
            question: "Simon: \"Au fait à quelle heure ils peuvent venir ?\"",
            options: [
                "Dès 7h du mat pour t'empêcher de me taper dessus",
                "Dès 12h30 pour le déjeuner",
                "A partir de 19h pour le dîner"
            ],
            correctAnswer: 1
        }
    ]
};