# Notes

## Auth

- [Tuto DigitalOcean : How To Add Login Authentication to React Applications](https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications)

### Available Users

- username: `sophiemartin`, password: `password123`
- username: `emmaleroy`, password: `password789`
- username: `marcdubois`, password: `password456`

## Questions

- ~~comment rediriger après le login ? (useNavigate) souci de hook quand j'essaie de rediriger~~
- intégration : 1024 ou 1440 de large (Specs = 1024, Figma = 1440)
- cookie côté client seul ou back + CSRF ? en l'état cookie client pas plus secure que localStorage
- ESLint / conventions : pas de ; en fin de ligne ? https://eslint.style/rules/semi
- gestion des dates du JSON, par semaine depuis janvier 2025 ? librairie de gestion de dates ? à la mano ?
  - les data de l'API ne matchent pas forcément exactement avec les graphes (pas tous les jours d'une semaine par ex.)
- créer un service/fichier pour traiter le JSON d'entrée (les statistiques) ?
- mettre des infos du profile dans un Context ?
- useFetch => le state de data y est délégué ?
- mixer on submit et le code dans useEffect()
  - utiliser une fonction externe ?
- bonus : ajouter un loader