import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  

  getToken() {
    return localStorage.getItem("token");
  }
}
