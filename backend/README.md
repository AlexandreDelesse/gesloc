# Gesloc Backend — ASP.NET Core

Ce dossier accueillera le backend ASP.NET Core existant (repo séparé à intégrer ici).

## Intégration

```bash
# Depuis la racine du monorepo, ajouter le repo backend comme remote et fetch
git remote add backend-origin <URL_DU_REPO_BACKEND>
git fetch backend-origin
# puis copier les fichiers dans ce dossier
```

## Structure attendue

```
backend/
├── Gesloc.Api/
│   ├── Controllers/
│   │   ├── BiensController.cs
│   │   ├── LocatairesController.cs
│   │   ├── BauxController.cs
│   │   └── PaiementsController.cs
│   ├── Data/
│   │   └── GeslocDbContext.cs    (EF Core + Global Query Filters par tenant_id)
│   ├── Middleware/
│   │   └── TenantMiddleware.cs   (lit tenant_id du JWT, injecte ITenantContext)
│   ├── Migrations/
│   ├── Models/
│   └── Program.cs
└── Dockerfile
```

## Dockerfile attendu

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore && dotnet publish -c Release -o /app/publish

FROM base AS final
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Gesloc.Api.dll"]
```
