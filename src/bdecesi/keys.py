import os

# L'ensemble des clés d'API sont regroupés dans ce fichiers
# ils prennent les paramètres en variables d'environnement

# Identifiant d'annuaire pour la connexion VIACESI
AUTH_VIACESI_TENANT_ID = os.getenv("VIACESI_TENANT_ID")

# Identifiant d'application pour la connexion VIACESI
AUTH_VIACESI_APP_ID = os.getenv("VIACESI_APP_ID")

# Secret d'application pour la connexion VIACESI
AUTH_VIACESI_APP_SECRET = os.getenv("VIACESI_APP_SECRET")