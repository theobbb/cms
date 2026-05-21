// AUTO-GENERATED — do not edit manually

export const copy_fr = {
  "dialogs": {
    "deleteAccount": {
      "title": "Delete your account?",
      "description": "This action cannot be undone.",
      "confirm": "Delete foreverss",
      "cancel": "Never mind"
    }
  },
  "tooltips": {
    "exportButton": "Export your data as CSV"
  },
  "members": {
    "invite_new_member_button": "Inviter",
    "self_quit": "Quitter",
    "dialog_invite_new_member": {
      "title": "Inviter un nouveau membre",
      "description": null,
      "fields": {
        "name": "nom du membre"
      },
      "confirm": "Inviter",
      "toast_sucess": "Invitation créée"
    },
    "dialog_share_invite": {
      "title": "Lien d’invitation",
      "description": "À envoyer manuellement à {name}",
      "warning": "À ouvrir sur l’appareil cible",
      "toast_on_copy_link_clipboard": "Lien copié"
    }
  }
} as const

export type Copy = typeof copy_fr
