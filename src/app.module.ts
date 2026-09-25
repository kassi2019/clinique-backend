import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccueilModule } from './accueil/accueil.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaisseModule } from './caisse/caisse.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { MedicamentsModule } from './medicaments/medicaments.module';
import { PharmacieModule } from './pharmacie/pharmacie.module';
import { AuthModule } from './auth/auth.module';
import { AssurancesModule } from './assurances/assurances.module';
import { CliniquesModule } from './cliniques/cliniques.module';
import { ImpressionModule } from './impression/impression.module';
import { ImagerieModule } from './imagerie/imagerie.module';
import { HospitalisationModule } from './hospitalisation/hospitalisation.module';
import { LaboratoireModule } from './laboratoire/laboratoire.module';
import { ModulesModule } from './modules/modules.module';
import { ParametresModule } from './parametres/parametres.module';
import { PersonnelModule } from './personnel/personnel.module';
import { PrestationsModule } from './prestations/prestations.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { ServicesModule } from './services/services.module';
import { StatistiquesModule } from './statistiques/statistiques.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { ListesParametresModule } from './listes-parametres/listes-parametres.module';
import { MaterniteModule } from './maternite/maternite.module';
import { SoinsModule } from './soins/soins.module';
import { RapportsModule } from './rapports/rapports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    AssurancesModule,
    AccueilModule,
    CaisseModule,
    ConsultationsModule,
    MedicamentsModule,
    PharmacieModule,
    LaboratoireModule,
    ImagerieModule,
    HospitalisationModule,
    CliniquesModule,
    ServicesModule,
    PersonnelModule,
    UtilisateursModule,
    RolesModule,
    ModulesModule,
    PrestationsModule,
    ParametresModule,
    ImpressionModule,
    StatistiquesModule,
    ListesParametresModule,
    MaterniteModule,
    SoinsModule,
    RapportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
