import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/** Changement de mot de passe par l'utilisateur connecté lui-même. */
export class ChangerMotDePasseDto {
  @IsString()
  @IsNotEmpty()
  motDePasseActuel: string;

  @IsString()
  @MinLength(6)
  nouveauMotDePasse: string;
}
