-- Accouchement en urgence : la DDR (et donc la DPA) est inconnue quand la
-- patiente arrive en travail. Ces colonnes deviennent nullables.
ALTER TABLE [grossesses] ALTER COLUMN [ddr] date NULL;
ALTER TABLE [grossesses] ALTER COLUMN [dpa] date NULL;
