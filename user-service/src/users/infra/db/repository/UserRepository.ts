import { IUserRepository } from '../../../domain/repository/iuser.repository';
import { User } from '../../../domain/user';
import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserFactory } from '../../../domain/user.factory';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    //`@InjectRepository` 데커레이터로 유저 저장소 주입
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  // 이메일 주소의 유저를 DB 에서 조회, 만일 없다면 null 리턴, 존재하면 User 도메인 객체 리턴
  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });

    if (!userEntity) {
      return null;
    }

    const { id, name, signupVerifyToken, password } = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  // createUserHandler 의 saveUserUsingTransaction() 내용 이관
  async save(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity(); // 유저 엔티티 객체 생성
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // 일부러 에러 발생 시 데이터 저장 안됨
      //throw new InternalServerErrorException();
    });
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email, password },
    });
    if (!userEntity) {
      return null;
    }

    const { id, name, signupVerifyToken } = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }

  async findBySignupVerifyToken(
    signupVerifyToken: string,
  ): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { signupVerifyToken },
    });
    if (!userEntity) {
      return null;
    }

    const { id, name, email, password } = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }
}
