-- Deuxième ligne de titre des fiches d'échographie (affichée sous le titre à l'impression)
-- NB : la colonne a été ajoutée manuellement en base ; cette migration est marquée
-- comme appliquée (migrate resolve) pour synchroniser l'historique Prisma.
ALTER TABLE [fiches_echographie] ADD [titre2] NVARCHAR(1000);
