# Utilisateur

```html
<bde-user
    role="Président"
    image-src="http://..."
    href="http://..."
>
    Dupond
</bde-user>
```

Le component utilisateur permet d'afficher un utilisateur de manière normalisé avec un éventuel rôle

## Attributs

* `role` : Le rôle de l'utilisateur
* `image-src` : URL de l'image de profil de l'utilisateur
* `href` : Un lien vers le profil de l'utilisateur ou bien un `mailto:` de son email

## Slots

* *default* : Le nom d'affichage de l'utilisateur