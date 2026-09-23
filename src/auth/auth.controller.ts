import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { ChangerMotDePasseDto } from './dto/changer-mot-de-passe.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.matricule, dto.motDePasse);
  }

  /** Profil complet de l'utilisateur connecté (vérifie le token). */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return this.authService.me(req.user.id);
  }

  /** L'utilisateur connecté change son propre mot de passe. */
  @UseGuards(JwtAuthGuard)
  @Post('changer-mot-de-passe')
  changerMotDePasse(@Req() req, @Body() dto: ChangerMotDePasseDto) {
    return this.authService.changerMotDePasse(
      req.user.id,
      dto.motDePasseActuel,
      dto.nouveauMotDePasse,
    );
  }

  /**
   * Configuration publique de la page de connexion (sans authentification) :
   * identité de la clinique et image paramétrée par l'administrateur.
   */
  @Get('config-public')
  async configPublic() {
    const clinique = await this.prisma.clinique.findFirst({
      where: { statut: 'ACTIF' },
      orderBy: { id: 'asc' },
      include: { parametre: true },
    });
    if (!clinique) {
      return { clinique: null, loginImage: null };
    }
    return {
      clinique: { id: clinique.id, code: clinique.code, nom: clinique.nom },
      loginImage: clinique.parametre?.loginImage ?? null,
    };
  }
}
