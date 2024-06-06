import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = false;
  private _userName = '';
  private storageKey = 'sunit';

  constructor() {
    
    const token = localStorage.getItem(this.storageKey);
    if (token) {
      this._isLoggedIn = true;
      this._userName = token;
    }
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get username(): string {
    return this._userName;
  }

  login(username: string, password: string): boolean {
    if (username === 'saikiran' && password === 'saikiran') {
      this._isLoggedIn = true;
      this._userName = username;
      const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
      localStorage.setItem('RMname', capitalizedUsername);
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this._isLoggedIn = false;
    this._userName = '';
    localStorage.removeItem(this.storageKey);
  }
}
