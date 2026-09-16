import { Module } from '@nestjs/common';
import { AccueilModule } from './accueil/accueil.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CliniquesModule } from './cliniques/cliniques.module';
import { ImpressionModule } from './impression/impression.module';
import { ModulesModule } from './modules/modules.module';
import { ParametresModule } from './parametres/parametres.module';
import { PersonnelModule } from './personnel/personnel.module';
import { PrestationsModule } from './prestations/prestations.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { ServicesModule } from './services/services.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AccueilModule,
    CliniquesModule,
    ServicesModule,
    PersonnelModule,
    UtilisateursModule,
    RolesModule,
    ModulesModule,
    PrestationsModule,
    ParametresModule,
    ImpressionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
