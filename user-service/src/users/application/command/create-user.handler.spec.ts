import * as uuid from 'uuid';
import * as ulid from 'ulid';
import { UserRepository } from 'src/users/infra/db/repository/UserRepository';
import { CreateUserHandler } from './create-user.handler';
import { Test } from '@nestjs/testing';
import { CreateUserCommand } from './create-user.command';
import { UserFactory } from '../../domain/user.factory';
import { UnprocessableEntityException } from '@nestjs/common';

// CreateUserHandler.execute() 에서 uuid, ulid 사용
// 외부 라이브러리가 생성하는 임의의 문자열이 항상 값은 값인 '0000-0000-0000-0000', 'ulid' 를 리턴하도록 함
jest.mock('uuid');
jest.mock('ulid');
jest.spyOn(uuid, 'v1').mockReturnValue('0000-0000-0000-0000');
jest.spyOn(ulid, 'ulid').mockReturnValue('ulid');

describe('CreateUserHandlerTest', () => {
  // 테스트 대상인 CreateUserHandler 와 의존하고 있는 클래스 선언
  let createUserHandler: CreateUserHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        // UserFactory, UserRepository 를 mock 객체로 제공
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userFactory = module.get(UserFactory);
    userRepository = module.get('UserRepository');
  });

  // 항상 같은 값을 갖는 변수를 미리 선언하고 재사용하도록 함
  const id = ulid.ulid();
  const name = 'assu';
  const email = 'test3@test.com';
  const password = 'password1234';
  const signupVerifyToken = uuid.v1();

  describe('executeTest', () => {
    it('should execute CreateUserHandler', async () => {
      // Given
      // userRepository 에 저장된 유저가 없는 조건 설정
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);

      // When
      // execute 함수 실행
      await createUserHandler.execute(
        new CreateUserCommand(name, email, password),
      );

      // Then
      // 수행 결과가 원하는 결과와 맞는지 검증
      // When 단계 수행 시 원하는 결과를 선언하고 Jest 에서 제공하는 Matcher 를 이용하여 판단
      // UserFactory 에서는 테스트 대상 클래스가 의존하고 있는 객체의 함수를 단순히 호출하는지만 검증했다면 이번엔 인수까지 제대로 넘기고 있는지 검증
      expect(userRepository.save).toBeCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );

      expect(userFactory.create).toBeCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );
    });

    // UserRepository 에 유저 정보가 있을 경우 test case
    it('should throw UnprocessableEntityException when user exists', async () => {
      // Given
      // 생성하려는 유저 정보가 이미 있는 경우를 mocking
      userRepository.findByEmail = jest.fn().mockResolvedValue({
        id,
        name,
        email,
        password,
        signupVerifyToken,
      });

      // When

      // Then
      // 원하는 예외가 발생하는가?
      await expect(
        createUserHandler.execute(new CreateUserCommand(name, email, password)),
      ).rejects.toThrowError(UnprocessableEntityException);
    });
  });
});
