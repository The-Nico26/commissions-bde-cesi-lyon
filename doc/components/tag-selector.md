# Selecteur de Tag

```html
<bde-tag-selector>
    <select data-max="3" multiple>
      <option value="Tag A" data-color="#04ade5">Tag A</option>
      <option value="Tag B" data-color="#e58704">Tag B</option>
      <option value="Tag C" data-color="#ad04e5">Tag C</option>
      <option value="Tag D" data-color="#00a53c">Tag D</option>
      <option value="Tag E" data-color="#0156b7">Tag E</option>
    </select>
</bde-tag-selector>
```

Champ de selection de tags dans un select multiple.

## Slots

* *default* (Requis) : Un champ `select` avec les éléments suivants :
    * Attribut `data-max` : Permettant de limiter le nombre de tags à un certain nombre
    * Des options avec le nom du tag en texte et avec les attributs suivants :
        * Attribut `data-color` (Requis) : Définissant la couleur du tag associa à cette option