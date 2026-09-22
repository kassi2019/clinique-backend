import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AffectationService } from '../affectation/affectation.service';

const includeUtilisateur = {
  personnel: { include: { service: true, clinique: true } },
  role: { include: { habilitations: { include: { module: true } } } },
} as const;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private affectationService: AffectationService,
  ) {}

  /**
   * Construit l'objet utilisateur renvoyé au frontend
   * (profil complet : identité, photo, rôle et habilitations).
   */
  private buildUser(u: {
    id: number;
    matricule: string;
    personnel: {
      id: number;
      matricule: string;
      nom: string;
      prenom: string;
      photo: string | null;
      fonction: string;
      service: { nom: string; code: string } | null;
      clinique: { id: number; code: string; nom: string };
    };
    role: {
      code: string;
      nom: string;
      habilitations: {
        module: { code: string; nom: string };
        lecture: boolean;
        ecriture: boolean;
        validation: boolean;
      }[];
    };
  }) {
    return {
      id: u.id,
      matricule: u.matricule,
      role: {
        code: u.role.code,
        nom: u.role.nom,
        modules: u.role.habilitations.map((h) => ({
          code: h.module.code,
          nom: h.module.nom,
          lecture: h.lecture,
          ecriture: h.ecriture,
          validation: h.validation,
        })),
      },
      personnel: {
        id: u.personnel.id,
        matricule: u.personnel.matricule,
        nom: u.personnel.nom,
        prenom: u.personnel.prenom,
        photo: u.personnel.photo,
        fonction: u.personnel.fonction,
        service: u.personnel.service
          ? { nom: u.personnel.service.nom, code: u.personnel.service.code }
          : null,
      },
      clinique: {
        id: u.personnel.clinique.id,
        code: u.personnel.clinique.code,
        nom: u.personnel.clinique.nom,
      },
    };
  }

  /**
   * Connexion par matricule + mot de passe (cf. cahier des charges §16.2).
   * Le matricule permet de retrouver le Personnel, puis de vérifier qu'un
   * compte Utilisateur actif lui est associé.
   */
  async login(matricule: string, motDePasse: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { matricule },
      include: includeUtilisateur,
    });

    if (!utilisateur || utilisateur.statut !== 'ACTIF') {
      throw new UnauthorizedException('Matricule ou mot de passe incorrect.');
    }

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse,
    );
    if (!motDePasseValide) {
      throw new UnauthorizedException('Matricule ou mot de passe incorrect.');
    }

    await this.prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: {
        derniereConnexion: new Date(),
        // Un médecin qui se connecte est automatiquement Disponible
        // (il peut ensuite se mettre Indisponible avec le bouton).
        disponibilite:
          utilisateur.role.code === 'MEDECIN' ? 'DISPONIBLE' : utilisateur.disponibilite,
        derniereActivite: new Date(),
      },
    });

    // Redistribution immédiate des patients non affectés vers ce médecin
    if (utilisateur.role.code === 'MEDECIN' && utilisateur.personnel?.cliniqueId) {
      try {
        await this.affectationService.redistribuerNonAffectees(
          utilisateur.personnel.cliniqueId,
        );
      } catch {
        /* la redistribution est tolérante */
      }
    }

    const payload = {
      sub: utilisateur.id,
      matricule: utilisateur.matricule,
      role: utilisateur.role.code,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      user: this.buildUser(utilisateur),
    };
  }

  /** Profil complet de l'utilisateur connecté (rafraîchi côté frontend). */
  async me(userId: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      include: includeUtilisateur,
    });
    if (!utilisateur) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }
    return this.buildUser(utilisateur);
  }
}
