import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {newUser} from "../../../domain/newUser";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  public usuario: newUser=new newUser();
  constructor(protected http: HttpClient, private auth: Auth) {}

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }
  entrar({ email, password }: any) {
    return this.http.post<Token>('/auth/login',  signInWithEmailAndPassword(this.auth, email, password));
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/me');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
  }

}
