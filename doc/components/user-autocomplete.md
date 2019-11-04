# Autompletion Utilisateur

```html
<bde-user-autocomplete>
    <select>
      <option value="" selected="">---------</option>
      <option value="-1" data-name="Dupond" data-email="dupond@example.com" data-profile-picture="http://gallery.marvelscollectionscustoms.com/albums/Statues-Collectibles/Weta/Others/Dupont-dupond_04.jpg">Dupond</option>
      <option value="0" data-name="Dupont" data-email="dupont@example.com" data-profile-picture="http://gallery.marvelscollectionscustoms.com/albums/Statues-Collectibles/Weta/Others/Dupont-dupond_04.jpg">Dupont</option>
      <option value="1" data-name="Tintin" data-email="tintin@example.com" data-profile-picture="https://pbs.twimg.com/profile_images/479882800737583104/l4l9QYs7.jpeg">Tintin</option>
      <option value="2" data-name="Tournesol" data-email="tournesol@example.com" data-profile-picture="https://laboussolite.files.wordpress.com/2016/11/image1322.png?w=414">Tournesol</option>
      <option value="3" data-name="Capitaine Haddock" data-email="capitaine@example.com" data-profile-picture="https://i.pinimg.com/originals/1f/11/6d/1f116d56d3da7b743f30e03a5e5629bb.jpg">Capitaine-haddock</option>
    </select>
</bde-user-autocomplete>
```

Un composant permettant de chercher et de séléctionner un utilisateur parmis une liste importante d'utilisateurs.
Le composant éfféctue une recherche au fur et a mesure de la frappe de l'utilisateur sur le nom et l'email de la liste.

# Slots

* *default* : Un unique champ `select` dont chacune des option est formatée comme suit (il est possible d'ajouter une option de valeur nulle pour prendre en compte la possibilité de vider le champ) : 
    * Attribut `data-name` (Requis) : Le nom d'affichage de l'utilisateur
    * Attribut `data-profile-picture` : L'URL de l'image de profil de l'utilisateur
    * Attribut `data-email` (Requis) : L'email de l'utilisateur