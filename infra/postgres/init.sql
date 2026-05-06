-- Gesloc — PostgreSQL schema
-- Multi-tenant isolation: tenant_id on every table, enforced by backend middleware (EF Core Global Query Filters)
-- All FK constraints use ON DELETE CASCADE so offboarding a tenant is a single DELETE on tenants table

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- SaaS client accounts (populated by onboard.sh, not by the app)
CREATE TABLE tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bailleurs (legal owner of properties)
-- Can be a natural person (personne physique) or a legal entity (SCI, SARL, etc.)
-- One tenant can have multiple bailleurs (e.g. personal properties + SCI properties)
CREATE TABLE bailleurs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type              TEXT NOT NULL CHECK (type IN ('personne_physique', 'personne_morale')),
  nom               TEXT NOT NULL,
  prenom            TEXT,            -- NULL for legal entities
  raison_sociale    TEXT,            -- e.g. "SCI Dupont & Associés"
  forme_juridique   TEXT,            -- e.g. SCI, SARL, EURL
  siret             TEXT,
  adresse_rue       TEXT NOT NULL,
  adresse_cp        TEXT NOT NULL,
  adresse_ville     TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bailleurs_tenant ON bailleurs(tenant_id);

-- Biens immobiliers
CREATE TABLE biens (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bailleur_id           UUID REFERENCES bailleurs(id),  -- nullable until Phase 4 adds bailleur selector
  nom                   TEXT NOT NULL,
  type                  TEXT NOT NULL CHECK (type IN ('appartement', 'maison', 'studio', 'autre')),
  surface               NUMERIC(6,2) NOT NULL,
  loyer                 NUMERIC(8,2),
  adresse_numero        INT,
  adresse_rue           TEXT NOT NULL,
  adresse_code_postal   TEXT NOT NULL,
  adresse_ville         TEXT NOT NULL,
  adresse_residence     TEXT,
  image_base64          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_biens_tenant ON biens(tenant_id);

-- Locataires immobiliers (rental tenants — distinct from SaaS tenants)
CREATE TABLE locataires (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nom           TEXT NOT NULL,
  prenom        TEXT NOT NULL,
  email         TEXT,
  telephone     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_locataires_tenant ON locataires(tenant_id);

-- Baux (lease contracts linking a bien to a locataire)
-- Dépôt de garantie: <= 1 month rent for unfurnished, <= 2 months for furnished (loi du 6 juillet 1989)
CREATE TABLE baux (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bien_id          UUID NOT NULL REFERENCES biens(id),
  locataire_id     UUID NOT NULL REFERENCES locataires(id),
  date_debut       DATE NOT NULL,
  date_fin         DATE,
  loyer_mensuel    NUMERIC(8,2) NOT NULL,
  charges          NUMERIC(8,2) NOT NULL DEFAULT 0,
  depot_garantie   NUMERIC(8,2),
  is_actif         BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_baux_tenant ON baux(tenant_id);
CREATE INDEX idx_baux_bien ON baux(tenant_id, bien_id);

-- Paiements de loyer
-- mois stored as first day of month (e.g. 2025-01-01 = January 2025)
-- statut: paye | en_attente | retard
-- Unique constraint prevents double-recording a payment for the same lease+month
CREATE TABLE paiements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bail_id       UUID NOT NULL REFERENCES baux(id),
  mois          DATE NOT NULL,
  montant       NUMERIC(8,2) NOT NULL,
  statut        TEXT NOT NULL CHECK (statut IN ('paye', 'en_attente', 'retard')),
  date_paiement DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bail_id, mois)
);
CREATE INDEX idx_paiements_tenant ON paiements(tenant_id);
CREATE INDEX idx_paiements_bail ON paiements(tenant_id, bail_id);
