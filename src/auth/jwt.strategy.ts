import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../tasks/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret-key-change-in-production',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
      relations: { roles: true }, // ← ДОБАВИТЬ: загружаем роли пользователя
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}