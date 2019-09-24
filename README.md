# Commissions BDE CESI Lyon
Plateforme de gestion des commissions du BDE CESI de Lyon.

## Installation de développement

Installez les prérequis avec pip

```sh-session
pip install -r requirements.txt
```

Créez le fichier `.env` dans le dossier du projet python.
Ce fichier contiens les paramètres secret de l'application.

```.env
SECRETKEY=azertyuiop
VIACESI_TENANT_ID=12345-67890
VIACESI_APP_ID=12345-67890
VIACESI_APP_SECRET=qsdfghjklm
ENVIRONMENT=development
DB_ENVIRONMENT=development
```

Deployez les migrations

```sh-session
python manage.py migrate
```

Démarrez le serveur de développement

```sh-session
python manage.py runserver
```

Rendez vous sur [localhost:8000](http://localhost:8000)

## Installation de production

Assurez vous d'avoir installé Docker, Docker-compose, Python et Pip.
Installez alors les prérequis.

```sh-session
pip install -r requirements.txt
```

Executez le script de déploiement

```sh-session
./deploy.sh
```