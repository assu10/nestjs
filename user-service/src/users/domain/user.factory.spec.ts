import { UserFactory } from './user.factory';
import { Test } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { User } from './user';

describe('UserFactoryTest', () => {
  let userFactory: UserFactory; // test suite 전체에서 사용할 UserFactory
  let eventBus: jest.Mocked<EventBus>; // Jest 에서 제공하는 Mocked 객체로 EventBus 선언

  // Test.createTestingModule() 함수를 이용하여 테스트 모듈 생성
  // 함수의 인수가 ModuleMetadata 이므로 모듈을 임포트할때와 동일하게 컴포넌트 가져올 수 있음
  // UserFactory 가 대상 클래스이므로 이 모듈을 프로바이더로 가져옴
  // 모듈을 가져오는 것은 전체 test suite 내에서 한 번만 이루어지므로 설정 단계인 beforeAll() 구문 내에서 수행
  // Test.createTestingModule() 의 리턴값은 TestingModuleBuilder 임, compile 함수를 수행하여 모듈 생성을 완료한다. (이 함수는 비동기로 처리됨)
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        // EventBus 를 프로바이더로 제공
        // 이 때 EventBus 의 함수를 mocking 함
        // publish 함수가 jest.fn() 으로 선언되었는데 이는 어떠한 동작도 하지 않는 함수라는 의미
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    userFactory = module.get(UserFactory); // 프로바이더로 제공된 UserFactory 객체를 테스트 모듈에서 가져옴
    eventBus = module.get(EventBus); // 프로바이더로 제공된 EventBus 객체를 테스트 모듈에서 가져옴
  });

  describe('createTest', () => {
    it('should create user', () => {
      // Given
      // 주어진 조건은 딱히 없으므로 작성하지 않음

      // When
      // create 함수 실행
      const user = userFactory.create(
        'user-id',
        'assu3',
        'test3@test.com',
        'password1234',
        'signup-verify-token',
      );

      // Then
      // 수행 결과가 원하는 결과와 맞는지 검증
      // When 단계 수행 시 원하는 결과를 선언하고 Jest 에서 제공하는 Matcher 를 이용하여 판단
      const expected = new User(
        'user-id',
        'assu3',
        'test3@test.com',
        'password1234',
        'signup-verify-token',
      );

      // UserFactory.create 를 통해 생성한 User 객체가 원하는 객체와 맞는지 검사
      expect(expected).toEqual(user);

      // EventBus.publish 함수가 한번 호출되었는지 판단
      expect(eventBus.publish).toBeCalledTimes(1);
    });
  });

  describe('reconstituteTest', () => {
    it('should reconstitute user', () => {
      // Given
      // 주어진 조건은 딱히 없으므로 작성하지 않음

      // When
      const user = userFactory.reconstitute(
        'user-id',
        'assu3',
        'test3@test.com',
        'password1234',
        'signup-verify-token',
      );

      // Then
      const expected = new User(
        'user-id',
        'assu3',
        'test3@test.com',
        'password1234',
        'signup-verify-token',
      );

      // UserFactory.create 를 통해 생성한 User 객체가 원하는 객체와 맞는지 검사
      expect(expected).toEqual(user);
    });
  });
});
