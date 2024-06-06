import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

describe('accessControlGuard', () => {
  const executeGuard: CanActivateFn = () =>
    beforeEach(() => {
      TestBed.configureTestingModule({});
    });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
