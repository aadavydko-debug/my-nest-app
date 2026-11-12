import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../tasks/entities/user.entity';
import { Role } from '../tasks/entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  // ===== Задание 1: Регистрация =====
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: registerDto.username },
        { email: registerDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким username или email уже существует',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  // ===== Задание 1: Проверка пользователя (для LocalStrategy) =====
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return user;
  }

  // ===== Задание 2: Генерация JWT =====
  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  // ===== Задание 3: Назначение роли =====
  async assignRole(userId: number, roleName: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { roles: true }, // ✅ Исправлено: объектный синтаксис
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    let role = await this.rolesRepository.findOne({ where: { name: roleName } });

    if (!role) {
      role = this.rolesRepository.create({ name: roleName });
      role = await this.rolesRepository.save(role);
    }

    user.roles = [...(user.roles || []), role];
    return this.usersRepository.save(user);
  }
}