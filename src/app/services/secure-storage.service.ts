import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SecureStorageService {

  private encrypt(value: string): string {
    let encrypted = CryptoJS.AES.encrypt(value.toString(), environment.appId.trim());
    return encrypted.toString();
  }

  private decrypt(secureValue: string): string {
    let decrypted = CryptoJS.AES.decrypt(secureValue.toString(), environment.appId.trim())
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  public setItem(key: string, value): void {
    let secureValue = this.encrypt(value);
    sessionStorage.setItem(key, secureValue);
  }

  public getItem(key: string): string {
    let secureValue = sessionStorage.getItem(key);
    return this.decrypt(secureValue);
  }

}