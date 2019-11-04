# Texte adaptatif 

```html
<style>
    body {
        font-size: 100px;
    }

    bde-autoresize {
        height: 50px;
    }
</style>
<bde-autoresize>Lorem ipsum dolor si amet</bde-autoresize>
```

L'élément de texte adaptatif permet d'ajuster la taille du texte pour qu'il tienne dans un contenant de taille défini.
Il faut alors définir lataille du contenant avec les propriétés `height` ou `max-height` puis le component affichera le texte avec la taille de texte définie ou inferieur.