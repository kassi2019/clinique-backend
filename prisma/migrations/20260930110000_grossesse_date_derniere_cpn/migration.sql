-- Date de la dernière CPN connue (saisie au calendrier : la patiente peut
-- avoir été suivie dans un autre centre avant d'arriver à la clinique).
ALTER TABLE [grossesses] ADD [dateDerniereCpn] date NULL;
