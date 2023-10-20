import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {


  private baseUrl: string = environments.baseURL;

  //Se pone privado porque no quieres hacer uso de él fuera de este servicio.
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone( this.user );
  }

  login(email: string, password: string): Observable<User> {

    // http.post('login', { email,password });

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
    .pipe(
      tap( user => this.user = user),
      tap( user => localStorage.setItem( 'token', 'sdjhahdsbdkasb' ))
    );
  }

  // Miramos si los datos existen en el js
  checkAuthenication(): Observable<boolean>{

    if (!localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    // TODO: Condiciones de existencia.

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
    .pipe(
      tap( user => this.user = user),
      map( user => !!user),
      catchError( error => of(false))
    )
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
