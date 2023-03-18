import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Test } from '@nestjs/testing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

// function deco(
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor,
// ) {
//   console.log(target, 'Decorator 가 평가됨');
// }
//
// class Test2Class {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   @deco
//   test() {
//     console.log('test 함수 호출');
//   }
// }
//
// const t = new Test2Class();
// t.test();

//////////////////////

// // 데코레이터 팩토리
// function Component(value: string) {
//   console.log(value);
//
//   // 데코레이터 함수
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   return function (target: Function) {
//     console.log(target);
//     console.log(target.prototype);
//   };
// }
//
// // 데코레이터 팩토리를 사용하면 값을 전달할 수 있습니다.
// @Component('tabs')
// class TabsComponent {}
//
// // TabsComponent 객체 생성
// const tabs = new TabsComponent();

//////////////////////

// function deco1(value: string) {
//   console.log('Decorator 평가됨');
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     console.log(value);
//   };
// }
//
// class TestClass1 {
//   @deco1('Hello')
//   test() {
//     console.log('함수 호출됨');
//   }
// }
//
// const t1 = new TestClass1();
// t1.test();

//////////////////////

// function first() {
//   console.log('first(): factory evaluated');
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     console.log('first(): called');
//   };
// }
//
// function second() {
//   console.log('second(): factory evaluated');
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     console.log('second(): called');
//   };
// }
//
// class ExampleClass {
//   @first()
//   @second()
//   method() {}
//}

//////////////////////

// Component 데코레이터
// eslint-disable-next-line @typescript-eslint/ban-types
// function Component(target: Function) {
//   // 프로토타입 객체 참조
//   const $ = target.prototype;
//
//   // 프로토타입 객체 확장
//   $.type = 'component111';
//   $.version = '0.0.1';
// }
// // Component 데코레이터 사용
// @Component
// class TabsComponent {}
//
// // TabsComponent 객체 인스턴스 생성
// const tabs = new TabsComponent();
//
// // 데코레이터로 설정된 프로토타입 확장은
// // 타입 단언(Type Assertion) 필요
// console.log((tabs as any).type); // 'component111' 출력
// console.log((tabs as any).version); // '0.0.1' 출력
// console.log((tabs as any).version2); // undefined 출력

//////////////////////

// function authorClassDecorator<T extends { new (...args: any[]): {} }>(
//   constructor: T,
// ) {
//   return class extends constructor {
//     // 속성
//     author = 'assu';
//     // 메서드
//     open() {
//       console.log('decorator open()');
//     }
//   };
// }
//
// @authorClassDecorator
// class TestClass {
//   type = 'testType';
//   title: string;
//   constructor(title: string) {
//     this.title = title;
//   }
//   open() {
//     console.log('사용자 정의 open()');
//   }
//
//   close() {
//     console.log('사용자 정의 close()');
//   }
// }
//
// const tc = new TestClass('제목');
//
// console.log(tc);
// console.log(tc.type);
// //console.log(tc.author); // 오류
// console.log((tc as any).author); // 오류
// console.log('---1', tc.open());
// console.log('---2', tc.close());

//////////////////////

// ClassType 타입 Alias 정의
// type AuthorClassType = {
//   title: string;
// };
//
// // 데코레이터 팩토리
// function AuthorClassDecorator(options: AuthorClassType) {
//   const _title = options.title;
//   // 데코레이터 함수
//   return function authorClassDecorator<T extends new (...args: any[]) => {}>(
//     constructor: T,
//   ) {
//     return class extends constructor {
//       title = `decorator 재정의값 ${_title}`;
//     };
//   };
// }
//
// @AuthorClassDecorator({ title: '테스트' })
// class TestClass {}
//
// // TestClass 객체 인스턴스 생성
// const tc = new TestClass();
// console.log(tc);
// console.log((tc as any).title);
// console.log((tc as any)._title);
// 오류 console.log(tc.title);

/////////////////////// 메서드 데코레이터: 기본 사용법 ////////////////

// 데코레이터 팩토리
// function enumerable(value: boolean) {
//   // 데코레이터 함수
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     descriptor.enumerable = value;
//   };
// }
//
// class Greeter {
//   greeting: string;
//   constructor(message: string) {
//     this.greeting = message;
//   }
//
//   @enumerable(false)
//   greet() {
//     return 'Hello, ' + this.greeting;
//   }
// }
//
// const t = new Greeter('assu');
// console.log(t.greet()); // Hello, assu

/////////////////////// 메서드 데코레이터: 함수 실행 도중 에러 발생 시 에러 catch 하여 처리 ////////////////

// function HandlerError() {
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     // 1
//     console.log('target: ', target); // 2
//     console.log(`propertyKey: ${propertyKey}`); // 3
//     console.log(`descriptor: `, descriptor); // 4
//
//     const method = descriptor.value; // 5
//
//     descriptor.value = function () {
//       try {
//         method(); // 6
//       } catch (e) {
//         // 에러 핸들링 로직 구현 // 7
//         console.log('Method decorator', e); // 8
//       }
//     };
//   };
// }
//
// class Greeter {
//   @HandlerError()
//   hello() {
//     throw new Error('테스트 에러');
//   }
// }
//
// const t = new Greeter();
// t.hello();

////////////////// Accessor Decorator 사용법 ///////////////////
// // 데코레이터 팩토리
// function Enumerable(value: boolean) {
//   // 데코레이터 함수
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     console.log('target: ', target);
//     console.log('propertyKey: ', propertyKey);
//     console.log('descriptor: ', descriptor);
//
//     descriptor.enumerable = value; // 1
//   };
// }
//
// class Person {
//   constructor(private name: string) {} // 2
//   @Enumerable(true) //  3
//   get getName() {
//     return this.name;
//   }
//   @Enumerable(true)
//   set setName(name: string) {
//     this.name = name;
//   }
// }
//
// const person = new Person('assu');
// for (const key in person) {
//   console.log(`for ${key} : ${person[key]}`); // 5
// }

/////////////////////// Property Decorator (속성 데커레이터) ////////////////
// import 'reflect-metadata';
// const formatMetadataKey = Symbol('format1');
//
// // 데커레이터 팩토리
// function format(formatString: string) {
//   // 데커레이터 함수
//   return Reflect.metadata(formatMetadataKey, formatString);
// }
//
// function getFormat(target: any, propertyKey: string) {
//   return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
// }
//
// class Greeter {
//   @format('Hello, %s')
//   greeting: string;
//
//   @format('Hello2, %s')
//   greeting2: string;
//   constructor(message: string, message2: string) {
//     this.greeting = message;
//     this.greeting2 = message2;
//   }
//   greet() {
//     const formatString = getFormat(this, 'greeting');
//     const formatString2 = getFormat(this, 'greeting2');
//     console.log('formatString: ', formatString); // 멤버변수인 greeting 의 format 인 Hello, %s 출력
//     console.log('formatString2: ', formatString2); // 멤버변수인 greeting 의 format 인 Hello, %s 출력
//     return formatString.replace('%s', this.greeting);
//   }
// }
//
// const t = new Greeter('assu!', 'assu2');
// console.log(t.greet());

/////////////////////// Property Decorator (속성 데커레이터) ////////////////
// 데커레이터 팩토리
// function format(formatString: string) {
//   // 데커레이터 함수
//   return function (target: any, propertyKey: string): any {
//     console.log('propertyKey: ', propertyKey);
//     console.log('target: ', target);
//     console.log('target[propertyKey]: ', target[propertyKey]);
//     let value = target[propertyKey];
//
//     function getter() {
//       return `${formatString} ${value}`; // 1
//     }
//
//     function setter(newVal: string) {
//       value = newVal;
//     }
//
//     return {
//       get: getter,
//       set: setter,
//       enumerable: true,
//       configurable: true,
//     };
//   };
// }
//
// class Greeter {
//   @format('hello~') // 2
//   greeting: string;
// }
//
// const t = new Greeter();
// t.greeting = 'assu';
// console.log(t.greeting); // 3

////////////////////// Parameter Decorator (매개변수 데커레이터) //////////////////
// import { BadRequestException } from '@nestjs/common';
//
// // 데커레이터 팩토리
// function MinLength(min: number) {
//   // 1
//   // 데커레이터 함수
//   return function (target: any, propertyKey: string, parameterIndex: number) {
//     console.log('target: ', target);
//     console.log('propertyKey: ', propertyKey);
//     console.log('parameterIndex: ', parameterIndex);
//
//     target.validators2 = {
//       // 2
//       minLength: function (args: string[]) {
//         // 3
//         return args[parameterIndex].length >= min; // 4
//       },
//     };
//   };
// }
//
// // 메서드 데커레이터
// function Validate(
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor,
// ) {
//   console.log('target: ', target);
//   console.log('propertyKey: ', propertyKey);
//   console.log('descriptor: ', descriptor);
//
//   const method = descriptor.value; // 6
//   console.log('method: ', method);
//   descriptor.value = function (...args) {
//     // 7
//     console.log('descriptor.value ...args: ', ...args);
//     console.log('target.validators2: ', target.validators2);
//     Object.keys(target.validators2).forEach(key => {
//       console.log('target.validators2[key]: ', target.validators2[key]);
//       console.log(
//         'target.validators2[key](args): ',
//         target.validators2[key](args),
//       );
//       // 8
//       if (!target.validators2[key](args)) {
//         // 9
//         throw new BadRequestException();
//       }
//     });
//     console.log('Validator args: ', args);
//     method.apply(this, args); // 10
//   };
// }
//
// class User {
//   private name: string;
//
//   @Validate
//   setName(@MinLength(3) name: string) {
//     this.name = name;
//   }
// }
//
// const t = new User();
// t.setName('assu'); // 11
// //t.setName('as'); // 12

////////////////////// Parameter Decorator (매개변수 데커레이터) //////////////////
bootstrap();
