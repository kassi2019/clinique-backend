-- Fiche d'inventaire : chaque comptage garde le stock théorique (avant) et le
-- stock réel compté (après), y compris quand l'écart est nul.
ALTER TABLE [mouvements_stock] ADD [stockAvant] INT NULL;
ALTER TABLE [mouvements_stock] ADD [stockApres] INT NULL;
