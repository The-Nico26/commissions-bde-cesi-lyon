# Carte de commissions

```html
<bde-commission-card
    banner-src="http://..."
    logo-src="http://"
    commission-name="Commission A"
    href="http://..."
    organization="bds"
>
    <span slot="meta">
        Création : 4 Janvier 1999
    </span>
    
    <bde-tag slot="tags" color="red">Red</bde-tag>
    
    Une description de commission
    
</bde-commission-card>
```

Le carte de commission est un élément de l'interface de taille fixe qui peut être utilisé pour afficher n'importe quel commission qui est déjà créée.

## Attributs

* `banner-src` : URL de la bannière de la commission. Par défault, la couleur primaire
* `logo-src` (Requis) : URL du logo de la commission
* `commission-name` (Requis) : Le nom de la commission
* `href` : L'éventuel lien vers la commission. Si présent, la carte deviens clickable
* `organization` : L'organisation à laquelle est rattachée la commission. Valeurs supportées : `bde`, `bds`

## Slots

* `meta` : Les métadonnées de la commission, affichés en bas de la carte
* `tags` : Les tags de la commission, affichés au dessous de la description
* *default* (Requis) : La description de la commission