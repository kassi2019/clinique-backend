import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SignatureCachetDto, SignatureService } from './signature.service';

/** Le prescripteur connecté gère lui-même sa signature et son cachet (bouton « ✍️ Ma signature »). */
@UseGuards(JwtAuthGuard)
@Controller('ma-signature')
export class MaSignatureController {
  constructor(private signatureService: SignatureService) {}

  @Get()
  async lire(@Req() req) {
    return this.signatureService.lire(await this.signatureService.personnelDe(req.user.id));
  }

  @Put()
  async enregistrer(@Req() req, @Body() dto: SignatureCachetDto) {
    return this.signatureService.enregistrer(await this.signatureService.personnelDe(req.user.id, true), dto);
  }
}
