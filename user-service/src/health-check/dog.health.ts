import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { HealthIndicatorResult } from '@nestjs/terminus/dist/health-indicator';

export interface Dog {
  name: string;
  type: string;
}

@Injectable()
export class DogHealthIndicator extends HealthIndicator {
  private dogs: Dog[] = [
    { name: 'Silby', type: 'good' },
    { name: 'Kamang', type: 'normal' },
  ];

  // 강아지 상태가 모두 good 인지 체크
  // normal 인 강아지가 있으면 HealthCheckError 던짐
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const normals = this.dogs.filter((dog) => dog.type === 'normal');
    const isHealthy = normals.length === 0;
    const result = this.getStatus(key, isHealthy, { normals: normals.length });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError(`-----------------`, result);
  }
}
