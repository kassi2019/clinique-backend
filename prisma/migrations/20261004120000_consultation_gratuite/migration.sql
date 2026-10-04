-- Consultation de contrôle : un patient qui revient dans les 10 jours pour le
-- MÊME service ne paie pas la consultation (montant 0, ligne marquée gratuite).
ALTER TABLE [passages_prestations] ADD [gratuit] bit NOT NULL CONSTRAINT [passages_prestations_gratuit_df] DEFAULT 0;
