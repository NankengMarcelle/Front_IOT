# ConfirmDialog Component

Composant de dialogue de confirmation personnalisé pour remplacer les `confirm()` et `alert()` natifs du navigateur.

## Utilisation

### 1. Import du hook

```tsx
import { useConfirmDialog } from "@/components/ConfirmDialog";
```

### 2. Utiliser dans votre composant

```tsx
export default function MyComponent() {
  const { confirm, alert } = useConfirmDialog();

  // Exemple de confirmation
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Supprimer l\'élément',
      message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger'
    });

    if (confirmed) {
      // Effectuer la suppression
    }
  };

  // Exemple d'alerte
  const showInfo = async () => {
    await alert(
      'Information',
      'Votre action a été effectuée avec succès.',
      'success'
    );
  };
}
```

## API

### `confirm(options)`

Affiche un dialogue de confirmation et retourne une Promise<boolean>.

**Options:**
- `title` (string): Titre du dialogue
- `message` (string): Message à afficher
- `confirmText` (string, optionnel): Texte du bouton de confirmation (défaut: "Confirmer")
- `cancelText` (string, optionnel): Texte du bouton d'annulation (défaut: "Annuler")
- `type` ('danger' | 'warning' | 'info' | 'success', optionnel): Type de dialogue (défaut: "info")

**Retour:** Promise<boolean> - `true` si confirmé, `false` si annulé

### `alert(title, message, type?)`

Affiche un dialogue d'alerte (sans bouton d'annulation).

**Paramètres:**
- `title` (string): Titre du dialogue
- `message` (string): Message à afficher
- `type` ('danger' | 'warning' | 'info' | 'success', optionnel): Type de dialogue (défaut: "info")

**Retour:** Promise<void>

## Types de dialogue

- **danger**: Rouge, pour les actions destructives (suppression, etc.)
- **warning**: Ambre, pour les avertissements
- **info**: Bleu, pour les informations générales
- **success**: Vert, pour les confirmations de succès

## Exemples

### Confirmation de suppression

```tsx
const handleDelete = async (id: string) => {
  const confirmed = await confirm({
    title: 'Supprimer la parcelle',
    message: 'Cette action est irréversible. Continuer ?',
    confirmText: 'Supprimer',
    type: 'danger'
  });

  if (confirmed) {
    await deleteParcelle(id);
  }
};
```

### Alerte de succès

```tsx
const handleSuccess = async () => {
  await alert(
    'Opération réussie',
    'Vos modifications ont été enregistrées.',
    'success'
  );
};
```

### Avertissement

```tsx
const handleWarning = async () => {
  const proceed = await confirm({
    title: 'Attention',
    message: 'Cette action peut affecter d\'autres éléments.',
    confirmText: 'Continuer',
    type: 'warning'
  });

  if (proceed) {
    // Continuer l'action
  }
};
```
