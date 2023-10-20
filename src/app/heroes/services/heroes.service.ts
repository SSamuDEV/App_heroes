import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {
  constructor(private http: HttpClient) { }

  private baseUrl = environments.baseURL;

  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }


  // Búsqueda por parámetro
  getHeroById(id: string):Observable<Hero | undefined> {
    return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  // Buscador humilde
  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl}/heroes?q=${ query }&_limit=6`);
  }

  addHero( hero: Hero ): Observable<Hero> {
    return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero);
  }

  updateHero( hero: Hero ): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id }`, hero);
  }

  deleteHero( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
    .pipe(
      catchError( err => of(false) ),
      map( resp => true )
    );
  }
}
